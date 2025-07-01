/* Configurações primordiais da SALA */

let room = HBInit({
    roomName: 'Teste',
    maxPlayers: 16,
    playerName: 'Bot',
    noPlayer: true,
    public: false
});

/* variáveis Globais */

const role = { PLAYER: 0, ADMIN: 1, MASTER: 2 };
const uniform = { COUNTRY: 0, CLUBLA: 1, CLUBEU: 2 };
const speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
const announcementColor = 0xfffafa;
let point = [{ x: 0, y: 0 },{ x: 0, y: 0 }];
let ballSpeed;
let lastPlayerKick = { id: 0, team: 0 };
let penultPlayerKick;
let undefeatedScore = 0;
let players;
let numberEachTeam;

/* variáveis dos times */

let nameHome = 'Mandante';
let acronymHome = 'Home';
let nameGuest = 'Visitante';
let acronymGuest = 'Away';
let emojihome = '🏠';
let emojiGuest = '✈️';
let playersTeamHome;
let playersTeamGuest;
let playersTeamSpec;
let goalsHome = [];
let goalsGuest = [];
let Hposs;
let Gposs;

/* Lista de comandos */

let commands = {
    "ajuda": {
        "similar": ["help"],
        "roles": role.PLAYER,
        "desc": `Este comando mostra todos os outros comandos disponíveis`,
        "function": helpCommand,
    },
    "quit": {
        "similar": ["quitar", "leave", "sair", "qt"],
        "roles": role.PLAYER,
        "desc": `Este comando te desconecta da sala.`,
        "function": leaveCommmand,
    },
    "uniforme": {
        "similar": ["uni", "uniformes", "uniform"],
        "roles": role.PLAYER,
        "desc": `Este comando mostra todos os uniformes disponíveis para seu time vestir.`,
        "function": uniformCommand,
    },
    "reserva": {
        "similar": ["sub"],
        "roles": role.PLAYER,
        "desc": `Este comando muda o uniforme de seu time para o uniforme reserva disponível.`,
        "function": reserveCommand,
    },
    "time": {
        "similar": ["team", "tm"],
        "roles": role.ADMIN,
        "desc": `Este comando define os times da sala.`,
        "function": teamCommand,
    },
    "restart": {
        "similar": ["rr", "res"],
        "roles": role.ADMIN,
        "desc": `Este comando reinicia a partida.`,
        "function": restartCommand,
    },
    "admin": {
        "similar": ["adm"],
        "roles": role.ADMIN,
        "desc": `Este comando concede ADMIN para outro player`,
        "function": adminCommand,
    },
}

/* Lista de uniformes */

let uniformes = {

    /* Times brasileiros */
    
    "cor": {
        "name": 'Corinthians',
        "type": Uniform.CLUBSA,
        "emoji": '⚪⚫⚪',
        "angle": 0,
        "textcolor": 0x000000,
        "color1": 0xFFFFFF,
        "color2": 0xFFFFFF,
        "color3": 0x000000,
        "angle2": 0,
        "textcolor2": 0xFFFFFF,
        "color21": 0x000000,
        "color22": 0x000000,
        "color23": 0xFFFFFF
    },
    "san": {
        "name": 'Santos',
        "type": Uniform.CLUBSA,
        "emoji": '⚪⚪⚪',
        "angle": 0,
        "textcolor": 0x000000,
        "color1": 0xFFFFFF,
        "color2": 0xFFFFFF,
        "color3": 0xFFFFFF,
        "angle2": 90,
        "textcolor2": 0xFFFFFF,
        "color21": 0xFFFFFF,
        "color22": 0x39C3DA,
        "color23": 0xFFFFFF
    },
    "mir": {
        "name": 'Mirassol',
        "type": Uniform.CLUBSA,
        "emoji": '🟡🟢🟡',
        "angle": 40,
        "textcolor": 0xFFFFFF,
        "color1": 0xDBC500,
        "color2": 0x015141,
        "color3": 0xDBC500,
        "angle2": 40,
        "textcolor2": 0x000000,
        "color21": 0xFFFFFF,
        "color22": 0xDBC500,
        "color23": 0xFFFFFF
    },
    "pal": {
        "name": 'Palmeiras',
        "type": Uniform.CLUBSA,
        "emoji": '🟢⚪🟢',
        "angle": 90,
        "textcolor": 0xFFFFFF,
        "color1": 0x118516,
        "color2": 0x118516,
        "color3": 0xFFFFFF,
        "angle2": 90,
        "textcolor2": 0x118516,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "sp": {
        "name": 'São Paulo',
        "type": Uniform.CLUBSA,
        "emoji": '⚪🔴⚫',
        "angle": 0,
        "textcolor": 0xFFFFFF,
        "color1": 0xEA272D,
        "color2": 0x000000,
        "color3": 0xEA272D,
        "angle2": 0,
        "textcolor2": 0xD61A19,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "fla": {
        "name": 'Flamengo',
        "type": Uniform.CLUBSA,
        "emoji": '🔴⚫🔴',
        "angle": 90,
        "textcolor": 0xFFFFFF,
        "color1": 0xC90202,
        "color2": 0x1F1F1F,
        "color3": 0xC90202,
        "angle2": 90,
        "textcolor2": 0x000000,
        "color21": 0xFFFFFF,
        "color22": 0xC90202,
        "color23": 0xFFFFFF
    },
    "vas": {
        "name": 'Vasco',
        "type": Uniform.CLUBSA,
        "emoji": '⚫⚪⚫',
        "angle": 135,
        "textcolor": 0xFF0000,
        "color1": 0x000000,
        "color2": 0xFFFFFF,
        "color3": 0x030303,
        "angle2": 135,
        "textcolor2": 0xFF0000,
        "color21": 0xFFFFFF,
        "color22": 0x000000,
        "color23": 0xFFFFFF
    },
    "bot": {
        "name": 'Botafogo',
        "type": Uniform.CLUBSA,
        "emoji": '⚪⚫⚪',
        "angle": 0,
        "textcolor": 0xFFFFFF,
        "color1": 0x000000,
        "color2": 0x000000,
        "color3": 0xFFFFFF,
        "angle2": 0,
        "textcolor2": 0x000000,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "flu": {
        "name": 'Fluminense',
        "type": Uniform.CLUBSA,
        "emoji": '🟢🔴⚪',
        "angle": 40,
        "textcolor": 0x000000,
        "color1": 0xA32222,
        "color2": 0xFFFFFF,
        "color3": 0x28585C,
        "angle2": 40,
        "textcolor2": 0xA32222,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "cru": {
        "name": 'Cruzeiro',
        "type": Uniform.CLUBSA,
        "emoji": '🔵⚪🔵',
        "angle": 0,
        "textcolor": 0xFFFFFF,
        "color1": 0x0F5BA5,
        "color2": 0x0F5BA5,
        "color3": 0xFFFFFF,
        "angle2": 0,
        "textcolor2": 0x0F5BA5,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "galo": {
        "name": 'Atletico Mineiro',
        "type": Uniform.CLUBSA,
        "emoji": '⚫⚪⚫',
        "angle": 0,
        "textcolor": 0xB59F38,
        "color1": 0x050505,
        "color2": 0xFFFFFF,
        "color3": 0x000000,
        "angle2": 0,
        "textcolor2": 0xB59F38,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "inter": {
        "name": 'Internacional',
        "type": Uniform.CLUBSA,
        "emoji": '🔴⚪🔴',
        "angle": 90,
        "textcolor": 0xFFFFFF,
        "color1": 0xFF0303,
        "color2": 0xFF0303,
        "color3": 0xFF0303,
        "angle2": 90,
        "textcolor2": 0xFF0303,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "grem": {
        "name": 'Grêmio',
        "type": Uniform.CLUBSA,
        "emoji": '🔵⚪🔵',
        "angle": 0,
        "textcolor": 0xFFFFFF,
        "color1": 0x1499FF,
        "color2": 0x141716,
        "color3": 0x1499FF,
        "angle2": 0,
        "textcolor2": 0xFFFFFF,
        "color21": 0x66C2FF,
        "color22": 0x66C2FF,
        "color23": 0x66C2FF
    },
    "bah": {
        "name": 'Bahia',
        "type": Uniform.CLUBSA,
        "emoji": '🔵⚪🔴',
        "angle": 0,
        "textcolor": 0x000000,
        "color1": 0x12B0FF,
        "color2": 0xFFFFFF,
        "color3": 0xFF1C33,
        "angle2": 120,
        "textcolor2": 0xE8E238,
        "color21": 0x4336FF,
        "color22": 0xF5FDFF,
        "color23": 0xFF2121
    },
    "vit": {
        "name": 'Vitória',
        "type": Uniform.CLUBSA,
        "emoji": '⚫🔴⚫',
        "angle": 90,
        "textcolor": 0xFFFFFF,
        "color1": 0xFF1D0D,
        "color2": 0x000000,
        "color3": 0x000000,
        "angle2": 0,
        "textcolor2": 0xFF1D0D,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "riv": {
        "name": 'River Plate',
        "type": Uniform.CLUBSA,
        "emoji": '⚪🔴⚪',
        "angle": 40,
        "textcolor": 0x000000,
        "color1": 0xFFFFFF,
        "color2": 0xFF1D0D,
        "color3": 0xFFFFFF,
        "angle2": 0,
        "textcolor2": 0xFFFFFF,
        "color21": 0xFF1D0D,
        "color22": 0x000000,
        "color23": 0xFF1D0D
    },
    "boca": {
        "name": 'Boca Juniors',
        "type": Uniform.CLUBSA,
        "emoji": '🔵🟡🔵',
        "angle": 90,
        "textcolor": 0xFFFFFF,
        "color1": 0x0C04E0,
        "color2": 0xE8E800,
        "color3": 0x0C04E0,
        "angle2": 0,
        "textcolor2": 0x3D3E52,
        "color21": 0xDEBA64,
        "color22": 0xDEBA64,
        "color23": 0xDEBA64
    },

    /* Times gringos */

    "psg": {
        "name": 'Paris Saint-Germain',
        "type": Uniform.CLUBEU,
        "emoji": '🔵⚪🔴',
        "angle": 180,
        "textcolor": 0xFFFFFF,
        "color1": 0x000080,
        "color2": 0xB22222,
        "color3": 0x000080,
        "angle2": 180,
        "textcolor2": 0x000080,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "bay": {
        "name": 'Bayern',
        "type": Uniform.CLUBEU,
        "emoji": '🔴⚪🔴',
        "angle": 30,
        "textcolor": 0xFFFFFF,
        "color1": 0xFF0000,
        "color2": 0xFF0000,
        "color3": 0xFF0000,
        "angle2": 30,
        "textcolor2": 0xFF0000,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "bor": {
        "name": 'Borussia',
        "type": Uniform.CLUBEU,
        "emoji": '⚫🟡⚫',
        "angle": 90,
        "textcolor": 0x000000,
        "color1": 0xEEEE00,
        "color2": 0xEEEE00,
        "color3": 0xEEEE00,
        "angle2": 90,
        "textcolor2": 0xBECC00,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "chel": {
        "name": 'Chelsea',
        "type": Uniform.CLUBEU,
        "emoji": '🔵⚪🔵',
        "angle": 90,
        "textcolor": 0xFFFFFF,
        "color1": 0x0000CD,
        "color2": 0x0000CD,
        "color3": 0x0000CD,
        "angle2": 90,
        "textcolor2": 0x0000CD,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "liv": {
        "name": 'Liverpool',
        "type": Uniform.CLUBEU,
        "emoji": '🔴🔴🔴',
        "angle": 40,
        "textcolor": 0xFFFFFF,
        "color1": 0xDF1C3C,
        "color2": 0xDF1C3C,
        "color3": 0xDF1C3C,
        "angle2": 40,
        "textcolor2": 0xDF1C3C,
        "color21": 0xFFFFFF,
        "color22": 0xFFFFFF,
        "color23": 0xFFFFFF
    },
    "ars": {
        "name": 'Arsenal',
        "type": Uniform.CLUBEU,
        "emoji": '⚪🔴⚪',
        "angle": 90,
        "textcolor": 0xFFFFFF,
        "color1": 0xFF0000,
        "color2": 0xFF0000,
        "color3": 0xFF0000,
        "angle2": 40,
        "textcolor2": 0xD8062D,
        "color21": 0x151C36,
        "color22": 0x32439D,
        "color23": 0x151C36
    },
    "juve": {
        "name": 'Juventus',
        "type": Uniform.CLUBEU,
        "emoji": '⚪⚫⚪',
        "angle": 40,
        "textcolor": 0xBFAC00,
        "color1": 0x000000,
        "color2": 0xFFFFFF,
        "color3": 0x000000,
        "angle2": 40,
        "textcolor2": 0xBFAC00,
        "color21": 0xB7E8F7,
        "color22": 0xFFFFFF,
        "color23": 0xB7E8F7
    },
    "itm": {
        "name": 'Internazionale',
        "type": Uniform.CLUBEU,
        "emoji": '🔵⚪🔵',
        "angle": 0,
        "textcolor": 0xFFFFFF,
        "color1": 0x001E94,
        "color2": 0x000000,
        "color3": 0x001E94,
        "angle2": 40,
        "textcolor2": 0x001E94,
        "color21": 0x92DFE5,
        "color22": 0xFFFFFF,
        "color23": 0x36A7E9
    },
    "nap": {
        "name": 'Napoli',
        "type": Uniform.CLUBEU,
        "emoji": '🔵⚪🔵',
        "angle": 0,
        "textcolor": 0xFFFFFF,
        "color1": 0x0099FF,
        "color2": 0x0099FF,
        "color3": 0x0099FF,
        "angle2": 0,
        "textcolor2": 0xFFFFFF,
        "color21": 0x1F1E22,
        "color22": 0x1F1E22,
        "color23": 0x1F1E22
    },
    "acm": {
        "name": 'Milan',
        "type": Uniform.CLUBEU,
        "emoji": '🔴⚪🔴',
        "angle": 0,
        "textcolor": 0xFFFFFF,
        "color1": 0xE80000,
        "color2": 0x000000,
        "color3": 0xE80000,
        "angle2": 40,
        "textcolor2": 0xE80000,
        "color21": 0x000000,
        "color22": 0x000000,
        "color23": 0x000000
    },
    "rma": {
        "name": 'Real Madrid',
        "type": Uniform.CLUBEU,
        "emoji": '⚪🟡⚪',
        "angle": 132,
        "textcolor": 0xFFCD45,
        "color1": 0xFFFFFF,
        "color2": 0x004077,
        "color3": 0xFFFFFF,
        "angle2": 132,
        "textcolor2": 0xFFFFFF,
        "color21": 0x004077,
        "color22": 0x004077,
        "color23": 0x004077
    },
    "fcb": {
        "name": 'Barcelona',
        "type": Uniform.CLUBEU,
        "emoji": '🔴🟡🔵',
        "angle": 0,
        "textcolor": 0xDEB405,
        "color1": 0xA2214B,
        "color2": 0x00529F,
        "color3": 0x00529F,
        "angle2": 40,
        "textcolor2": 0x0E3E90,
        "color21": 0x1E1E1E,
        "color22": 0x1E1E1E,
        "color23": 0x1E1E1E
    },
    "val": {
        "name": 'Valencia',
        "type": Uniform.CLUBEU,
        "emoji": '🟡🔴🟡',
        "angle": 0,
        "textcolor": 0x000000,
        "color1": 0xFFFFFF,
        "color2": 0xFFFFFF,
        "color3": 0xFFFFFF,
        "angle2": 0,
        "textcolor2": 0xF87667,
        "color21": 0xA3172D,
        "color22": 0xA3172D,
        "color23": 0xA3172D
    },
    "rb": {
        "name": 'Real Betis',
        "type": Uniform.CLUBEU,
        "emoji": '🟢⚪🟢',
        "angle": 0,
        "textcolor": 0x000000,
        "color1": 0x00DE3B,
        "color2": 0xFFFAFA,
        "color3": 0x00DE3B,
        "angle2": 0,
        "textcolor2": 0xFFFFFF,
        "color21": 0x017CA5,
        "color22": 0x017CA5,
        "color23": 0x017CA5
    },

    /* Times custom */

    "reggae": {
        "name": 'Reggae',
        "type": Uniform.CLUBCS,
        "emoji": '🔴🟡🟢',
        "angle": 90,
        "textcolor": 0x000000,
        "color1": 0xFF0000,
        "color2": 0xFFFF00,
        "color3": 0x006400,
        "angle2": 90,
        "textcolor2": 0x000000,
        "color21": 0xFF0000,
        "color22": 0xFFFF00,
        "color23": 0x006400
    },
    "cdl": {
        "name": 'Catadores de Latinha',
        "type": Uniform.CLUBCS,
        "emoji": '🟠⚫🟠',
        "angle": 40,
        "textcolor": 0xFFFFFF,
        "color1": 0xFD4700,
        "color2": 0x282828,
        "color3": 0xFD4700,
        "angle2": 40,
        "textcolor2": 0xFFFFFF,
        "color21": 0x282828,
        "color22": 0xFD4700,
        "color23": 0x282828
    },
}

/* Configurações principais da SALA */

room.setDefaultStadium('Big');
room.setScoreLimit(0);
room.setTimeLimit(3);
room.setTeamsLock(true);

/* Configurações de PLAYERS */

function updateAdmins() {
    let players = room.getPlayerList();
    if (players.length == 0) return;
    if (players.find((player) => player.admin) != null) return;
    room.setPlayerAdmin(players[0].id, true);
}

room.onPlayerJoin = function (player) {
    updateAdmins();
};

room.onPlayerLeave = function (player) {
    updateAdmins();
};
