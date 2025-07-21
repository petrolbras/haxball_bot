/* Configurações primordiais da SALA */

let room = HBInit ({
    roomName: "Teste",
    maxPlayers: 16,
    noPlayer: false,
    public: false,
    geo: { "code": 'br', "lat": -12.9704, "lon": -38.5124 }
});

/* variáveis Globais */

let playerAuth = [];
let authWhiteList = [];
const Role = { PLAYER: 0, ADMIN: 1};
const Uniform = { CLUBLA: 0, CLUBEU: 1, CLUBCS: 2 };
let adminPassword = "messi"
let speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
let point = [
    { "x": 0, "y": 0 },
    { "x": 0, "y": 0 }
];
let ballSpeed;
let lastPlayerKick = { id: 0, team: 0 };
let penultPlayerKick;
let players;
let isHomeReserve = false;
let isGuestReserve = false;
let isGameRunning = false
let afkPlayers = new Set();
let teamChangeCooldown = new Set()
let mapaAtual = false
let IgnorarTrocaBot = false
let OnOvertime = false
let checkTimeVariable = false;
let drawTimeLimit = 1
let playerList = []
let lastGoalTime = 0

/* Cores */

let welcomeColor = 0x47A2E7;
let commandsColor = 0xE1BB32;

/* variáveis dos times */

let nameHome = 'Mandante';
let acronymHome = 'Home';
let nameGuest = 'Visitante';
let acronymGuest = 'Away';
let emojiHome = '🏠';
let emojiGuest = '✈️';
let playersTeamHome;
let playersTeamGuest;
let playersTeamSpec;
let goalsHome = [];
let goalsGuest = [];
let Hposs;
let Gposs;
const Team = {
    SPECTATORS: 0,
    RED: 1,
    BLUE: 2
};

/* Lista de comandos */

const commands = {
    "ajuda": {
        "similar": ['help'],
        "roles": Role.PLAYER,
        "desc": `Este comando mostra todos os outros comandos disponíveis`,
        "function": helpCommand,
    },
    "quit": {
        "similar": ['quitar', 'leave', 'sair', 'qt', 'bb'],
        "roles": Role.PLAYER,
        "desc": `Este comando te desconecta da sala.`,
        "function": leaveCommand,
    },
    "uniforme": {
        "similar": ['uni', 'uniforms', 'uniform'],
        "roles": Role.ADMIN,
        "desc": `Este comando mostra todos os uniforms disponíveis para seu time vestir.`,
        "function": uniformCommand,
    },
    "reserva": {
        "similar": ['sub'],
        "roles": Role.ADMIN,
        "desc": `Este comando muda o uniforme de seu time para o uniforme reserva disponível.`,
        "function": reserveCommand,
    },
    "restart": {
        "similar": ['rr', 'res'],
        "roles": Role.ADMIN,
        "desc": `Este comando reinicia a partida.`,
        "function": restartCommand,
    },
    "admin": {
        "similar": ['adm'],
        "roles": Role.ADMIN,
        "desc": `Este comando concede ADMIN para outro player`,
        "function": adminCommand,
    },
    "unadmin": {
        "similar": ["unadm"],
        "roles": Role.ADMIN,
        "desc": `Este comando remove ADMIN de um jogador`,
        "function": unadminCommand,
    },
    "sala": {
        "similar": ['room', 'mapa'],
        "roles": Role.ADMIN,
        "desc": `Este comando altera o mapa`,
        "function": roomCommand,
    },
    "afk": {
        "similar": [],
        "roles": Role.PLAYER,
        "desc": `Este comando permite você ficar AFK por tempo ilimitado`,
        "function": afkCommand,
    }
};

/* Lista de uniforms */

let uniforms = {

    /* Times brasileiros */

        "cor": {
            "name": "Corinthians",
            "type": Uniform.CLUBSA,
            "emoji": "⚪⚫⚪",
            "angle": 0,
            "textcolor": 0x000000,
            "color1": 0xffffff,
            "color2": 0xffffff,
            "color3": 0x000000,
            "angle2": 0,
            "textcolor2": 0xffffff,
            "color21": 0x000000,
            "color22": 0x000000,
            "color23": 0xffffff
        },
        "san": {
            "name": "Santos",
            "type": Uniform.CLUBSA,
            "emoji": "⚪⚪⚪",
            "angle": 0,
            "textcolor": 0x000000,
            "color1": 0xffffff,
            "color2": 0xffffff,
            "color3": 0xffffff,
            "angle2": 90,
            "textcolor2": 0xffffff,
            "color21": 0xffffff,
            "color22": 0x39c3da,
            "color23": 0xffffff
        },
        "mir": {
            "name": "Mirassol",
            "type": Uniform.CLUBSA,
            "emoji": "🟡🟢🟡",
            "angle": 40,
            "textcolor": 0xffffff,
            "color1": 0xdbc500,
            "color2": 0x015141,
            "color3": 0xdbc500,
            "angle2": 40,
            "textcolor2": 0x000000,
            "color21": 0xffffff,
            "color22": 0xdbc500,
            "color23": 0xffffff
        },
        "pal": {
            "name": "Palmeiras",
            "type": Uniform.CLUBSA,
            "emoji": "🟢⚪🟢",
            "angle": 90,
            "textcolor": 0xffffff,
            "color1": 0x118516,
            "color2": 0x118516,
            "color3": 0xffffff,
            "angle2": 90,
            "textcolor2": 0x118516,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "sp": {
            "name": "São Paulo",
            "type": Uniform.CLUBSA,
            "emoji": "⚪🔴⚫",
            "angle": 0,
            "textcolor": 0xffffff,
            "color1": 0xea272d,
            "color2": 0x000000,
            "color3": 0xea272d,
            "angle2": 0,
            "textcolor2": 0xd61a19,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "fla": {
            "name": "Flamengo",
            "type": Uniform.CLUBSA,
            "emoji": "🔴⚫🔴",
            "angle": 90,
            "textcolor": 0xffffff,
            "color1": 0xc90202,
            "color2": 0x1f1f1f,
            "color3": 0xc90202,
            "angle2": 90,
            "textcolor2": 0x000000,
            "color21": 0xffffff,
            "color22": 0xc90202,
            "color23": 0xffffff
        },
        "vas": {
            "name": "Vasco",
            "type": Uniform.CLUBSA,
            "emoji": "⚫⚪⚫",
            "angle": 135,
            "textcolor": 0xff0000,
            "color1": 0x000000,
            "color2": 0xffffff,
            "color3": 0x030303,
            "angle2": 135,
            "textcolor2": 0xff0000,
            "color21": 0xffffff,
            "color22": 0x000000,
            "color23": 0xffffff
        },
        "bot": {
            "name": "Botafogo",
            "type": Uniform.CLUBSA,
            "emoji": "⚪⚫⚪",
            "angle": 0,
            "textcolor": 0xffffff,
            "color1": 0x000000,
            "color2": 0x000000,
            "color3": 0xffffff,
            "angle2": 0,
            "textcolor2": 0x000000,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "flu": {
            "name": "Fluminense",
            "type": Uniform.CLUBSA,
            "emoji": "🟢🔴⚪",
            "angle": 40,
            "textcolor": 0x000000,
            "color1": 0xa32222,
            "color2": 0xffffff,
            "color3": 0x28585c,
            "angle2": 40,
            "textcolor2": 0xa32222,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "cru": {
            "name": "Cruzeiro",
            "type": Uniform.CLUBSA,
            "emoji": "🔵⚪🔵",
            "angle": 0,
            "textcolor": 0xffffff,
            "color1": 0x0f5ba5,
            "color2": 0x0f5ba5,
            "color3": 0xffffff,
            "angle2": 0,
            "textcolor2": 0x0f5ba5,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "galo": {
            "name": "Atletico Mineiro",
            "type": Uniform.CLUBSA,
            "emoji": "⚫⚪⚫",
            "angle": 0,
            "textcolor": 0xb59f38,
            "color1": 0x050505,
            "color2": 0xffffff,
            "color3": 0x000000,
            "angle2": 0,
            "textcolor2": 0xb59f38,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "inter": {
            "name": "Internacional",
            "type": Uniform.CLUBSA,
            "emoji": "🔴⚪🔴",
            "angle": 90,
            "textcolor": 0xffffff,
            "color1": 0xff0303,
            "color2": 0xff0303,
            "color3": 0xff0303,
            "angle2": 90,
            "textcolor2": 0xff0303,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "grem": {
            "name": "Grêmio",
            "type": Uniform.CLUBSA,
            "emoji": "🔵⚪🔵",
            "angle": 0,
            "textcolor": 0xffffff,
            "color1": 0x1499ff,
            "color2": 0x141716,
            "color3": 0x1499ff,
            "angle2": 0,
            "textcolor2": 0xffffff,
            "color21": 0x66c2ff,
            "color22": 0x66c2ff,
            "color23": 0x66c2ff
        },
        "bah": {
            "name": "Bahia",
            "type": Uniform.CLUBSA,
            "emoji": "🔵⚪🔴",
            "angle": 0,
            "textcolor": 0x000000,
            "color1": 0x12b0ff,
            "color2": 0xffffff,
            "color3": 0xff1c33,
            "angle2": 120,
            "textcolor2": 0xe8e238,
            "color21": 0x4336ff,
            "color22": 0xf5fdff,
            "color23": 0xff2121
        },
        "vit": {
            "name": "Vitória",
            "type": Uniform.CLUBSA,
            "emoji": "⚫🔴⚫",
            "angle": 90,
            "textcolor": 0xffffff,
            "color1": 0xff1d0d,
            "color2": 0x000000,
            "color3": 0x000000,
            "angle2": 0,
            "textcolor2": 0xff1d0d,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "riv": {
            "name": "River Plate",
            "type": Uniform.CLUBSA,
            "emoji": "⚪🔴⚪",
            "angle": 40,
            "textcolor": 0x000000,
            "color1": 0xffffff,
            "color2": 0xff1d0d,
            "color3": 0xffffff,
            "angle2": 0,
            "textcolor2": 0xffffff,
            "color21": 0xff1d0d,
            "color22": 0x000000,
            "color23": 0xff1d0d
        },
        "boca": {
            "name": "Boca Juniors",
            "type": Uniform.CLUBSA,
            "emoji": "🔵🟡🔵",
            "angle": 90,
            "textcolor": 0xffffff,
            "color1": 0x0c04e0,
            "color2": 0xe8e800,
            "color3": 0x0c04e0,
            "angle2": 0,
            "textcolor2": 0x3d3e52,
            "color21": 0xdeba64,
            "color22": 0xdeba64,
            "color23": 0xdeba64
        },
    
        /* Times gringos */
    
        "psg": {
            "name": "Paris Saint-Germain",
            "type": Uniform.CLUBEU,
            "emoji": "🔵⚪🔴",
            "angle": 180,
            "textcolor": 0xffffff,
            "color1": 0x000080,
            "color2": 0xb22222,
            "color3": 0x000080,
            "angle2": 180,
            "textcolor2": 0x000080,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "bay": {
            "name": "Bayern",
            "type": Uniform.CLUBEU,
            "emoji": "🔴⚪🔴",
            "angle": 30,
            "textcolor": 0xffffff,
            "color1": 0xff0000,
            "color2": 0xff0000,
            "color3": 0xff0000,
            "angle2": 30,
            "textcolor2": 0xff0000,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "bor": {
            "name": "Borussia",
            "type": Uniform.CLUBEU,
            "emoji": "⚫🟡⚫",
            "angle": 90,
            "textcolor": 0x000000,
            "color1": 0xeeee00,
            "color2": 0xeeee00,
            "color3": 0xeeee00,
            "angle2": 90,
            "textcolor2": 0xbecc00,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "chel": {
            "name": "Chelsea",
            "type": Uniform.CLUBEU,
            "emoji": "🔵⚪🔵",
            "angle": 90,
            "textcolor": 0xffffff,
            "color1": 0x0000cd,
            "color2": 0x0000cd,
            "color3": 0x0000cd,
            "angle2": 90,
            "textcolor2": 0x0000cd,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "liv": {
            "name": "Liverpool",
            "type": Uniform.CLUBEU,
            "emoji": "🔴🔴🔴",
            "angle": 40,
            "textcolor": 0xffffff,
            "color1": 0xdf1c3c,
            "color2": 0xdf1c3c,
            "color3": 0xdf1c3c,
            "angle2": 40,
            "textcolor2": 0xdf1c3c,
            "color21": 0xffffff,
            "color22": 0xffffff,
            "color23": 0xffffff
        },
        "ars": {
            "name": "Arsenal",
            "type": Uniform.CLUBEU,
            "emoji": "⚪🔴⚪",
            "angle": 90,
            "textcolor": 0xffffff,
            "color1": 0xff0000,
            "color2": 0xff0000,
            "color3": 0xff0000,
            "angle2": 40,
            "textcolor2": 0xd8062d,
            "color21": 0x151c36,
            "color22": 0x32439d,
            "color23": 0x151c36
        },
        "juve": {
            "name": "Juventus",
            "type": Uniform.CLUBEU,
            "emoji": "⚪⚫⚪",
            "angle": 40,
            "textcolor": 0xbfac00,
            "color1": 0x000000,
            "color2": 0xffffff,
            "color3": 0x000000,
            "angle2": 40,
            "textcolor2": 0xbfac00,
            "color21": 0xb7e8f7,
            "color22": 0xffffff,
            "color23": 0xb7e8f7
        },
        "itm": {
            "name": "Internazionale",
            "type": Uniform.CLUBEU,
            "emoji": "🔵⚪🔵",
            "angle": 0,
            "textcolor": 0xffffff,
            "color1": 0x001e94,
            "color2": 0x000000,
            "color3": 0x001e94,
            "angle2": 40,
            "textcolor2": 0x001e94,
            "color21": 0x92dfe5,
            "color22": 0xffffff,
            "color23": 0x36a7e9
        },
        "nap": {
            "name": "Napoli",
            "type": Uniform.CLUBEU,
            "emoji": "🔵⚪🔵",
            "angle": 0,
            "textcolor": 0xffffff,
            "color1": 0x0099ff,
            "color2": 0x0099ff,
            "color3": 0x0099ff,
            "angle2": 0,
            "textcolor2": 0xffffff,
            "color21": 0x1f1e22,
            "color22": 0x1f1e22,
            "color23": 0x1f1e22
        },
        "acm": {
            "name": "Milan",
            "type": Uniform.CLUBEU,
            "emoji": "🔴⚪🔴",
            "angle": 0,
            "textcolor": 0xffffff,
            "color1": 0xe80000,
            "color2": 0x000000,
            "color3": 0xe80000,
            "angle2": 40,
            "textcolor2": 0xe80000,
            "color21": 0x000000,
            "color22": 0x000000,
            "color23": 0x000000
        },
        "rma": {
            "name": "Real Madrid",
            "type": Uniform.CLUBEU,
            "emoji": "⚪🟡⚪",
            "angle": 132,
            "textcolor": 0xffcd45,
            "color1": 0xffffff,
            "color2": 0x004077,
            "color3": 0xffffff,
            "angle2": 132,
            "textcolor2": 0xffffff,
            "color21": 0x004077,
            "color22": 0x004077,
            "color23": 0x004077
        },
        "fcb": {
            "name": "Barcelona",
            "type": Uniform.CLUBEU,
            "emoji": "🔴🟡🔵",
            "angle": 0,
            "textcolor": 0xdeb405,
            "color1": 0xa2214b,
            "color2": 0x00529f,
            "color3": 0x00529f,
            "angle2": 40,
            "textcolor2": 0x0e3e90,
            "color21": 0x1e1e1e,
            "color22": 0x1e1e1e,
            "color23": 0x1e1e1e
        },
        "val": {
            "name": "Valencia",
            "type": Uniform.CLUBEU,
            "emoji": "🟡🔴🟡",
            "angle": 0,
            "textcolor": 0x000000,
            "color1": 0xffffff,
            "color2": 0xffffff,
            "color3": 0xffffff,
            "angle2": 0,
            "textcolor2": 0xf87667,
            "color21": 0xa3172d,
            "color22": 0xa3172d,
            "color23": 0xa3172d
        },
        "rb": {
            "name": "Real Betis",
            "type": Uniform.CLUBEU,
            "emoji": "🟢⚪🟢",
            "angle": 0,
            "textcolor": 0x000000,
            "color1": 0x00de3b,
            "color2": 0xfffafa,
            "color3": 0x00de3b,
            "angle2": 0,
            "textcolor2": 0xffffff,
            "color21": 0x017ca5,
            "color22": 0x017ca5,
            "color23": 0x017ca5
        },
    
        /* Times custom */
    
        "reggae": {
            "name": "Reggae",
            "type": Uniform.CLUBCS,
            "emoji": "🔴🟡🟢",
            "angle": 90,
            "textcolor": 0x000000,
            "color1": 0xff0000,
            "color2": 0xffff00,
            "color3": 0x006400,
            "angle2": 90,
            "textcolor2": 0xffffff,
            "color21": 0x006400,
            "color22": 0xffff00,
            "color23": 0xff0000
        },
        "cdl": {
            "name": "Catadores de Latinha",
            "type": Uniform.CLUBCS,
            "emoji": "🟠⚫🟠",
            "angle": 40,
            "textcolor": 0xffffff,
            "color1": 0xfd4700,
            "color2": 0x282828,
            "color3": 0xfd4700,
            "angle2": 40,
            "textcolor2": 0xffffff,
            "color21": 0x282828,
            "color22": 0xfd4700,
            "color23": 0x282828
    }
}
    

/* Estádios */

const mapas = {
    "x1": `{
	"name" : "Arena x1 e x2",

	"width" : 420,

	"height" : 200,

	"spawnDistance" : 180,

	"bg" : { "type" : "hockey", "width" : 368, "height" : 171, "kickOffRadius" : 65, "cornerRadius" : 0 },

	"vertexes" : [
		{ "x" : -368, "y" : 171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -368, "y" : 65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -368, "y" : -65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -368, "y" : -171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 368, "y" : 171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 368, "y" : 65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 368, "y" : -65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 368, "y" : -171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 0, "y" : 65, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" : -65, "trait" : "line" },
        { "x" : 368, "y" : 171, "bCoef" : 1, "trait" : "ballArea" },
		{ "x" : 368, "y" : -171, "bCoef" : 1, "trait" : "ballArea" },
		{ "x" : 0, "y" : 171, "bCoef" : 0, "trait" : "line" },
		{ "x" : 0, "y" : -171, "bCoef" : 0, "trait" : "line" },
	    { "x" : 0, "y" : 65, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" : -65, "trait" : "kickOffBarrier" },
		{ "x" : 377, "y" : -65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
	    { "x" : 377, "y" : -171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -377, "y" : -65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
	    { "x" : -377, "y" : -171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -377, "y" : 65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
		{ "x" : -377, "y" : 171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 377, "y" : 65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
		{ "x" : 377, "y" : 171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
        { "x" : 0, "y" : 199, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" : 65, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" : -65, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" : -199, "trait" : "kickOffBarrier" },
		{ "x" : -368.53340356886, "y" : -62.053454903872, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
		{ "x" : -400.05760771891, "y" : -62.053454903872, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
		{ "x" : -400.05760771891, "y" : 64.043361696331, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
		{ "x" : -368.53340356886, "y" : 64.043361696331, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
		{ "x" : 368.09926357786, "y" : 63.94882446641, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
		{ "x" : 400, "y" : 64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
		{ "x" : 400, "y" : -61.927767991658, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
		{ "x" : 368.9681846993, "y" : -62.144998272018, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
		{ "x" : -368, "y" : -142.37229643041, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
		{ "x" : -260.90035258157, "y" : -50.168480548544, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
		{ "x" : -368, "y" : -160.81305960678, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
		{ "x" : -358.5379338963, "y" : -171, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
		{ "x" : -368, "y" : 141.33175243687, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
		{ "x" : -260.90035258157, "y" : 49.127936555002, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
		{ "x" : -368, "y" : 159.77251561324, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
		{ "x" : -358.5379338963, "y" : 171, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
		{ "x" : 368, "y" : 159.77251561324, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
		{ "x" : 358.36266315432, "y" : 171, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
		{ "x" : 368, "y" : -160.81305960678, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
		{ "x" : 358.36266315432, "y" : -171, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
		{ "x" : 368, "y" : -142.37229643041, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
		{ "x" : 260.72508183959, "y" : -50.168480548544, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
		{ "x" : 368, "y" : 141.33175243687, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
		{ "x" : 260.72508183959, "y" : 49.127936555002, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
		{ "x" : 260.72508183959, "y" : -50.168480548544, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
		{ "x" : 260.72508183959, "y" : 49.127936555002, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
		{ "x" : -250.86909422732, "y" : -1.2295321189394, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -250.86909422732, "y" : 0.18898812539692, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -250.86909422732, "y" : -2.6480523632758, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -250.86909422732, "y" : 1.6075083697333, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -250.86909422732, "y" : 0.89824824756514, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -250.86909422732, "y" : -1.9387922411076, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -250.86909422732, "y" : 1.9621384308174, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -250.86909422732, "y" : -3.0026824243599, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : -1.2295321189394, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : 0.18898812539692, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : -2.6480523632758, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : 1.6075083697333, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : 0.89824824756514, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : -1.9387922411076, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : 1.9621384308174, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 250.69382348534, "y" : -3.0026824243599, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : -1.2295321189394, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : 0.18898812539692, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : -2.6480523632758, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : 1.6075083697333, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : 0.89824824756514, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : -1.9387922411076, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : 1.9621384308174, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : -185.66591492467, "y" : -3.0026824243599, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : -1.2295321189394, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : 0.18898812539692, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : -2.6480523632758, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : 1.6075083697333, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : 0.89824824756514, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : -1.9387922411076, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : 1.9621384308174, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
		{ "x" : 185.49064418269, "y" : -3.0026824243599, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
	    { "x" : -160.58776903904, "y" : -159.39453936245, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : -160.58776903904, "y" : -182.09086327183, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : -80.337702205015, "y" : -159.39453936245, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : -80.337702205015, "y" : -182.09086327183, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : 160.41249829706, "y" : -159.39453936245, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : 160.41249829706, "y" : -182.09086327183, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : 80.162431463036, "y" : -159.39453936245, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : 80.162431463036, "y" : -182.09086327183, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : -254.88159756902, "y" : -171, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : -254.88159756902, "y" : -182.09086327183, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : -371.91294503531, "y" : -87.759267023458, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : -384.61920561736, "y" : -87.759267023458, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : 371.73767429333, "y" : -87.759267023458, "bCoef" : 0.1, "trait" : "line" },
	    { "x" : 384.44393487538, "y" : -87.759267023458, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : -371.91294503531, "y" : 86.718723029916, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : -384.61920561736, "y" : 86.718723029916, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : 371.73767429333, "y" : 86.718723029916, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : 384.44393487538, "y" : 86.718723029916, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : -254.88159756902, "y" : 171, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : -254.88159756902, "y" : 181.05031927829, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : 254.70632682704, "y" : -171, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : 254.70632682704, "y" : -182.09086327183, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : 254.70632682704, "y" : 171, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : 254.70632682704, "y" : 181.05031927829, "bCoef" : 0.1, "trait" : "line" },
		{ "x" : 377, "y" : -65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
	    { "x" : 377, "y" : -171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -377, "y" : -65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
		{ "x" : -377, "y" : -171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -377, "y" : 65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
		{ "x" : -377, "y" : 171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 377, "y" : 65, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "line" },
		{ "x" : 377, "y" : 171, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 371, "y" : -65, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 371, "y" : -171, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 371, "y" : 65, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : 371, "y" : 171, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -371, "y" : 65, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -371, "y" : 171, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -371, "y" : -65, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
		{ "x" : -371, "y" : -171, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" }
	],

	"segments" : [
		{ "v0" : 0, "v1" : 1, "trait" : "ballArea" },
		{ "v0" : 2, "v1" : 3, "trait" : "ballArea" },
		{ "v0" : 4, "v1" : 5, "trait" : "ballArea" },
		{ "v0" : 6, "v1" : 7, "trait" : "ballArea" },
		
		{ "v0" : 8, "v1" : 9, "curve" : 180, "cGroup" : ["blueKO" ], "trait" : "kickOffBarrier" },
		{ "v0" : 8, "v1" : 9, "curve" : -180, "cGroup" : ["redKO" ], "trait" : "kickOffBarrier" },
		
		{ "v0" : 1, "v1" : 0, "vis" : true, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -368 },
		{ "v0" : 5, "v1" : 4, "vis" : true, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 368 },
		{ "v0" : 2, "v1" : 3, "vis" : true, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -368 },
		{ "v0" : 6, "v1" : 7, "vis" : true, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 368 },
		{ "v0" : 0, "v1" : 10, "vis" : true, "color" : "FFFFFF", "bCoef" : 1, "trait" : "ballArea", "y" : 171 },
		{ "v0" : 3, "v1" : 11, "vis" : true, "color" : "FFFFFF", "bCoef" : 1, "trait" : "ballArea", "y" : -171 },
		
		{ "v0" : 12, "v1" : 13, "curve" : 0, "vis" : true, "color" : "FFFFFF", "bCoef" : 0, "trait" : "line" },
		{ "v0" : 9, "v1" : 8, "curve" : -180, "vis" : true, "color" : "FFFFFF", "bCoef" : 0, "trait" : "line" },
		{ "v0" : 15, "v1" : 14, "curve" : 180, "vis" : true, "color" : "FFFFFF", "bCoef" : 0, "trait" : "line" },
		{ "v0" : 2, "v1" : 1, "curve" : 0, "vis" : true, "color" : "FFFFFF", "bCoef" : 0, "trait" : "line" },
		{ "v0" : 6, "v1" : 5, "curve" : 0, "vis" : true, "color" : "FFFFFF", "bCoef" : 0, "trait" : "line" },
		
		{ "v0" : 16, "v1" : 17, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 330 },
		{ "v0" : 18, "v1" : 19, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -330 },
		{ "v0" : 20, "v1" : 21, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -330 },
		{ "v0" : 22, "v1" : 23, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 330 },
		
		{ "v0" : 24, "v1" : 25, "trait" : "kickOffBarrier" },
		{ "v0" : 26, "v1" : 27, "trait" : "kickOffBarrier" },
		
		{ "v0" : 28, "v1" : 29, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,-80 ], "y" : -80 },
		{ "v0" : 29, "v1" : 30, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : -590 },
		{ "v0" : 30, "v1" : 31, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,80 ], "y" : 80 },
		{ "v0" : 32, "v1" : 33, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,-80 ], "y" : -80 },
		{ "v0" : 33, "v1" : 34, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : -590 },
		{ "v0" : 34, "v1" : 35, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,80 ], "y" : 80 },
		
		{ "v0" : 36, "v1" : 37, "curve" : 94.0263701017, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 39, "v1" : 38, "curve" : 86.632306418889, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 40, "v1" : 41, "curve" : -94.026370101699, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 37, "v1" : 41, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 43, "v1" : 42, "curve" : -86.632306418888, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 45, "v1" : 44, "curve" : 86.632306418884, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 47, "v1" : 46, "curve" : -86.632306418899, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 48, "v1" : 49, "curve" : -94.026370101699, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 50, "v1" : 51, "curve" : 94.026370101699, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
		{ "v0" : 52, "v1" : 53, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 390 },
		{ "v0" : 55, "v1" : 54, "curve" : -180.00692920292, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 54, "v1" : 55, "curve" : -180.00218240614, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 57, "v1" : 56, "curve" : -179.64823645332, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 56, "v1" : 57, "curve" : -180.35758668147, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 59, "v1" : 58, "curve" : -180.02357323962, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 58, "v1" : 59, "curve" : -180.00924102399, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 61, "v1" : 60, "curve" : -180.06885755885, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 60, "v1" : 61, "curve" : -180.02948353257, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
		{ "v0" : 63, "v1" : 62, "curve" : -179.99869069543, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 62, "v1" : 63, "curve" : -179.99939258776, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 65, "v1" : 64, "curve" : -180.08826047163, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 64, "v1" : 65, "curve" : -179.91186753664, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 67, "v1" : 66, "curve" : -179.99528711105, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 66, "v1" : 67, "curve" : -179.99743836358, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 69, "v1" : 68, "curve" : -179.98626041101, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 68, "v1" : 69, "curve" : -179.99175181595, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
		{ "v0" : 71, "v1" : 70, "curve" : -180.04715562398, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 70, "v1" : 71, "curve" : -179.95294709391, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 73, "v1" : 72, "curve" : -179.95715750564, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 72, "v1" : 73, "curve" : -179.89943871875, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 75, "v1" : 74, "curve" : -179.94773754738, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 74, "v1" : 75, "curve" : -179.98221351296, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 77, "v1" : 76, "curve" : -180.4151727218, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 76, "v1" : 77, "curve" : -179.58764458796, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
		{ "v0" : 79, "v1" : 78, "curve" : -180.00086646359, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 78, "v1" : 79, "curve" : -180.01965986376, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 81, "v1" : 80, "curve" : -180.03532601389, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 80, "v1" : 81, "curve" : -179.99380079, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 83, "v1" : 82, "curve" : -180.0044468452, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 82, "v1" : 83, "curve" : -180.01386779847, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 85, "v1" : 84, "curve" : -180.05158287563, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 84, "v1" : 85, "curve" : -180.01212223878, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
		{ "v0" : 86, "v1" : 87, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240 },
		{ "v0" : 88, "v1" : 89, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -120 },
		{ "v0" : 90, "v1" : 91, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 240 },
		{ "v0" : 92, "v1" : 93, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 120 },
		{ "v0" : 94, "v1" : 95, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -381 },
		{ "v0" : 96, "v1" : 97, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : 123 },
		{ "v0" : 98, "v1" : 99, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : 123 },
		{ "v0" : 100, "v1" : 101, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : -123 },
		{ "v0" : 102, "v1" : 103, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : -123 },
		{ "v0" : 104, "v1" : 105, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -381 },
		{ "v0" : 106, "v1" : 107, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 381 },
		{ "v0" : 108, "v1" : 109, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 381 },
		
		{ "v0" : 110, "v1" : 111, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 330 },
		{ "v0" : 112, "v1" : 113, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -330 },
		{ "v0" : 114, "v1" : 115, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -330 },
		{ "v0" : 116, "v1" : 117, "vis" : false, "color" : "FFFFFF", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 330 },
		{ "v0" : 118, "v1" : 119, "vis" : false, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 371 },
		{ "v0" : 120, "v1" : 121, "vis" : false, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 371 },
		{ "v0" : 122, "v1" : 123, "vis" : false, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -371 },
		{ "v0" : 124, "v1" : 125, "vis" : false, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -371 }

	],

	"goals" : [
		{ "p0" : [-374.25,-62.053454903872 ], "p1" : [-374.25,64.043361696331 ], "team" : "red" },
		{ "p0" : [374.25,62 ], "p1" : [374.25,-62 ], "team" : "blue" }

	],

	"discs" : [
		{ "radius" : 3.9405255187564, "pos" : [-368.53340356886,64.043361696331 ], "color" : "6666CC", "trait" : "goalPost", "y" : 80 },
		{ "radius" : 3.9405255187564, "pos" : [-368.53340356886,-62.053454903872 ], "color" : "6666CC", "trait" : "goalPost", "y" : -80, "x" : -560 },
		{ "radius" : 3.9405255187564, "pos" : [368.9681846993,-62.144998272018 ], "color" : "6666CC", "trait" : "goalPost", "y" : 80 },
		{ "radius" : 3.9405255187564, "pos" : [368.09926357786,63.94882446641 ], "color" : "6666CC", "trait" : "goalPost", "y" : -80, "x" : -560 },
		
		{ "radius" : 3, "invMass" : 0, "pos" : [-368,-171 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
		{ "radius" : 3, "invMass" : 0, "pos" : [-368,171 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
		{ "radius" : 3, "invMass" : 0, "pos" : [368,171 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
		{ "radius" : 3, "invMass" : 0, "pos" : [368,-171 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" }

	],

	"planes" : [
		{ "normal" : [0,1 ], "dist" : -171, "trait" : "ballArea" },
		{ "normal" : [0,-1 ], "dist" : -171, "trait" : "ballArea" },
		
		{ "normal" : [0,1 ], "dist" : -200, "bCoef" : 0.2, "cMask" : ["all" ] },
		{ "normal" : [0,-1 ], "dist" : -200, "bCoef" : 0.2, "cMask" : ["all" ] },
		{ "normal" : [1,0 ], "dist" : -420, "bCoef" : 0.2, "cMask" : ["all" ] },
		{ "normal" : [-1,0 ], "dist" : -420, "bCoef" : 0.2, "cMask" : ["all" ] }

	],

	"traits" : {
		"ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball" ] },
		"goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 1 },
		"goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["all" ] },
		"kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ] },
		"line" : { "vis" : true, "bCoef" : 0, "cMask" : ["" ] },
		"arco" : { "radius" : 2, "cMask" : ["n/d" ], "color" : "cccccc" }

	},

	"playerPhysics" : {
		"acceleration" : 0.11,
		"kickingAcceleration" : 0.083,
		"kickStrength" : 5,
		"bCoef" : 0

	},

	"ballPhysics" : {
		"radius" : 6.25,
		"color" : "FFCC00",
		"bCoef" : 0.4,
		"invMass" : 1.5,
		"damping" : 0.99

	}
}`,
      
    "x3": `{
    "name": "Arena x3",
	"width": 648,
	"height": 270,  
	"spawnDistance": 350,
	"bg": {
		"type": "",
		"width": 550,
		"height": 240,
		"kickOffRadius": 80,
		"cornerRadius": 0,
		"color": "1b2029"
	},
	"vertexes": [
		{
			"x": 550,
			"y": 240,
			"trait": "ballArea"
		},
		{
			"x": 550,
			"y": -240,
			"trait": "ballArea"
		},
		{
			"x": 0,
			"y": 270,
			"trait": "kickOffBarrier"
		},
		{
			"x": 0,
			"y": 80,
			"trait": "kickOffBarrier",
			"color": "F8F8F8",
			"vis": true,
			"curve": 180
		},
		{
			"x": 0,
			"y": -80,
			"trait": "kickOffBarrier",
			"color": "F8F8F8",
			"vis": true,
			"curve": 180
		},
		{
			"x": 0,
			"y": -270,
			"trait": "kickOffBarrier"
		},
		{
			"x": -550,
			"y": -80,
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"curve": 0,
			"color": "FF6666",
			"pos": [
				-700,
				-80
			]
		},
		{
			"x": -590,
			"y": -80,
			"cMask": [
				"ball"
			],
			"trait": "goalNet",
			"curve": -28.940588200131774,
			"color": "FF6666",
			"pos": [
				-700,
				-80
			]
		},
		{
			"x": -590,
			"y": 80,
			"cMask": [
				"ball"
			],
			"trait": "goalNet",
			"curve": -28.940588200131774,
			"color": "FF6666",
			"pos": [
				-700,
				80
			]
		},
		{
			"x": -550,
			"y": 80,
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"curve": 0,
			"color": "FF6666",
			"pos": [
				-700,
				80
			]
		},
		{
			"x": 550,
			"y": -80,
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"curve": 0,
			"color": "479BD8",
			"pos": [
				700,
				-80
			]
		},
		{
			"x": 590,
			"y": -80,
			"cMask": [
				"ball"
			],
			"trait": "goalNet",
			"curve": 0,
			"color": "479BD8",
			"pos": [
				700,
				-80
			]
		},
		{
			"x": 590,
			"y": 80,
			"cMask": [
				"ball"
			],
			"trait": "goalNet",
			"curve": 0,
			"color": "479BD8",
			"pos": [
				700,
				80
			]
		},
		{
			"x": 550,
			"y": 80,
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"curve": 0,
			"color": "479BD8",
			"pos": [
				700,
				80
			]
		},
		{
			"x": -550,
			"y": 80,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"color": "F8F8F8",
			"pos": [
				-700,
				80
			]
		},
		{
			"x": -550,
			"y": 240,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"color": "F8F8F8"
		},
		{
			"x": -550,
			"y": -80,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"color": "F8F8F8",
			"pos": [
				-700,
				-80
			]
		},
		{
			"x": -550,
			"y": -240,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"color": "F8F8F8"
		},
		{
			"x": -550,
			"y": 240,
			"bCoef": 1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea"
		},
		{
			"x": 550,
			"y": 240,
			"bCoef": 1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea"
		},
		{
			"x": 550,
			"y": 80,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"pos": [
				700,
				80
			]
		},
		{
			"x": 550,
			"y": 240,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea"
		},
		{
			"x": 550,
			"y": -240,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"color": "F8F8F8"
		},
		{
			"x": 550,
			"y": -80,
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"color": "F8F8F8",
			"pos": [
				700,
				-80
			]
		},
		{
			"x": 550,
			"y": -240,
			"bCoef": 0,
			"cMask": [
				"ball"
			],
			"trait": "ballArea"
		},
		{
			"x": 550,
			"y": -240,
			"bCoef": 0,
			"cMask": [
				"ball"
			],
			"trait": "ballArea"
		},
		{
			"x": -550,
			"y": -240,
			"bCoef": 1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"curve": 0
		},
		{
			"x": 550,
			"y": -240,
			"bCoef": 1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"curve": 0
		},
		{
			"x": 0,
			"y": -240,
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"cGroup": [
				"redKO",
				"blueKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"x": 0,
			"y": -80,
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"cGroup": [
				"redKO",
				"blueKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"x": 0,
			"y": 80,
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"cGroup": [
				"redKO",
				"blueKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"x": 0,
			"y": 240,
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"cGroup": [
				"redKO",
				"blueKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"x": 0,
			"y": -80,
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"trait": "kickOffBarrier",
			"vis": true,
			"color": "F8F8F8"
		},
		{
			"x": 0,
			"y": 80,
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"trait": "kickOffBarrier",
			"vis": true,
			"color": "F8F8F8"
		},
		{
			"x": 0,
			"y": 80,
			"trait": "kickOffBarrier",
			"color": "F8F8F8",
			"vis": true,
			"curve": -180
		},
		{
			"x": 0,
			"y": -80,
			"trait": "kickOffBarrier",
			"color": "F8F8F8",
			"vis": true,
			"curve": -180
		},
		{
			"x": 0,
			"y": 80,
			"trait": "kickOffBarrier",
			"color": "F8F8F8",
			"vis": true,
			"curve": 0
		},
		{
			"x": 0,
			"y": -80,
			"trait": "kickOffBarrier",
			"color": "F8F8F8",
			"vis": true,
			"curve": 0
		},
		{
			"x": -557.5,
			"y": 80,
			"bCoef": 0.1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"curve": 0,
			"vis": false,
			"pos": [
				-700,
				80
			]
		},
		{
			"x": -557.5,
			"y": 240,
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"curve": 0,
			"vis": false
		},
		{
			"x": -557.5,
			"y": -240,
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"vis": false,
			"curve": 0
		},
		{
			"x": -557.5,
			"y": -80,
			"bCoef": 0.1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"vis": false,
			"curve": 0,
			"pos": [
				-700,
				-80
			]
		},
		{
			"x": 557.5,
			"y": -240,
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"vis": false,
			"curve": 0
		},
		{
			"x": 557.5,
			"y": -80,
			"bCoef": 0.1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"vis": false,
			"curve": 0,
			"pos": [
				700,
				-80
			]
		},
		{
			"x": 557.5,
			"y": 80,
			"bCoef": 0.1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"curve": 0,
			"vis": false,
			"pos": [
				700,
				80
			]
		},
		{
			"x": 557.5,
			"y": 240,
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"curve": 0,
			"vis": false
		},
		{
			"x": 0,
			"y": -80,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 0,
			"y": 80,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -550,
			"y": -80,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -550,
			"y": 80,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 550,
			"y": -80,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 550,
			"y": 80,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -381,
			"y": 240,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -381,
			"y": 256,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -550,
			"y": 200,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": -90
		},
		{
			"x": -390,
			"y": 70,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": 0
		},
		{
			"x": -550,
			"y": 226,
			"bCoef": 0.1,
			"trait": "line",
			"curve": -90
		},
		{
			"x": -536,
			"y": 240,
			"bCoef": 0.1,
			"trait": "line",
			"curve": -90
		},
		{
			"x": -550,
			"y": -200,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": 90
		},
		{
			"x": -390,
			"y": -70,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": 0
		},
		{
			"x": -550,
			"y": -226,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 90
		},
		{
			"x": -536,
			"y": -240,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 90
		},
		{
			"x": -556,
			"y": 123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -575,
			"y": 123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 556,
			"y": 123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 575,
			"y": 123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -556,
			"y": -123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -575,
			"y": -123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 556,
			"y": -123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 575,
			"y": -123,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -381,
			"y": -240,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": -381,
			"y": -256,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 381,
			"y": 240,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 381,
			"y": -240,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 381,
			"y": -256,
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"x": 550,
			"y": -226,
			"bCoef": 0.1,
			"trait": "line",
			"curve": -90
		},
		{
			"x": 536,
			"y": -240,
			"bCoef": 0.1,
			"trait": "line",
			"curve": -90
		},
		{
			"x": 550,
			"y": 226,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 90
		},
		{
			"x": 536,
			"y": 240,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 90
		},
		{
			"x": 550,
			"y": 200,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": 90
		},
		{
			"x": 390,
			"y": 70,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": 90
		},
		{
			"x": 550,
			"y": -200,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": -90
		},
		{
			"x": 390,
			"y": -70,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": -90
		},
		{
			"x": 390,
			"y": 70,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": 0
		},
		{
			"x": 390,
			"y": -70,
			"bCoef": 0.1,
			"trait": "line",
			"color": "F8F8F8",
			"curve": 0
		},
		{
			"x": -375,
			"y": 1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -375,
			"y": -1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -375,
			"y": 3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -375,
			"y": -3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -375,
			"y": -2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -375,
			"y": 2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -375,
			"y": -3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -375,
			"y": 3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": 1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": -1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": 3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": -3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": -2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": 2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": -3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 375,
			"y": 3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": 1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": -1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": 3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": -3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": -2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": 2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": -3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": -277.5,
			"y": 3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": 1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": -1,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": 3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": -3,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": -2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": 2,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": -3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		},
		{
			"x": 277.5,
			"y": 3.5,
			"bCoef": 0.1,
			"trait": "line",
			"curve": 180
		}
	],
	"segments": [
		{
			"v0": 6,
			"v1": 7,
			"curve": 0,
			"color": "FF6666",
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"pos": [
				-700,
				-80
			],
			"y": -80
		},
		{
			"v0": 7,
			"v1": 8,
			"curve": -28.940588200131774,
			"color": "FF6666",
			"cMask": [
				"ball"
			],
			"trait": "goalNet",
			"x": -590
		},
		{
			"v0": 8,
			"v1": 9,
			"curve": 0,
			"color": "FF6666",
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"pos": [
				-700,
				80
			],
			"y": 80
		},
		{
			"v0": 10,
			"v1": 11,
			"curve": 0,
			"color": "479BD8",
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"pos": [
				700,
				-80
			],
			"y": -80
		},
		{
			"v0": 11,
			"v1": 12,
			"curve": 28.940588200131774,
			"color": "479BD8",
			"cMask": [
				"ball"
			],
			"trait": "goalNet",
			"x": 590
		},
		{
			"v0": 12,
			"v1": 13,
			"curve": 0,
			"color": "479BD8",
			"cMask": [
				"red",
				"blue",
				"ball"
			],
			"trait": "goalNet",
			"pos": [
				700,
				80
			],
			"y": 80
		},
		{
			"v0": 2,
			"v1": 3,
			"trait": "kickOffBarrier"
		},
		{
			"v0": 3,
			"v1": 4,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"cGroup": [
				"blueKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"v0": 3,
			"v1": 4,
			"curve": -180,
			"vis": true,
			"color": "F8F8F8",
			"cGroup": [
				"redKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"v0": 4,
			"v1": 5,
			"trait": "kickOffBarrier"
		},
		{
			"v0": 14,
			"v1": 15,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": -550
		},
		{
			"v0": 16,
			"v1": 17,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": -550
		},
		{
			"v0": 18,
			"v1": 19,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"y": 240
		},
		{
			"v0": 20,
			"v1": 21,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": 550
		},
		{
			"v0": 22,
			"v1": 23,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 1.25,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": 550
		},
		{
			"v0": 24,
			"v1": 25,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": 550,
			"y": -240
		},
		{
			"v0": 26,
			"v1": 27,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 1,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"y": -240
		},
		{
			"v0": 28,
			"v1": 29,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"cGroup": [
				"redKO",
				"blueKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"v0": 30,
			"v1": 31,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"cMask": [
				"red",
				"blue"
			],
			"cGroup": [
				"redKO",
				"blueKO"
			],
			"trait": "kickOffBarrier"
		},
		{
			"v0": 38,
			"v1": 39,
			"curve": 0,
			"vis": false,
			"color": "F8F8F8",
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": -557.5
		},
		{
			"v0": 40,
			"v1": 41,
			"curve": 0,
			"vis": false,
			"color": "F8F8F8",
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": -557.5
		},
		{
			"v0": 42,
			"v1": 43,
			"curve": 0,
			"vis": false,
			"color": "F8F8F8",
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": 557.5
		},
		{
			"v0": 44,
			"v1": 45,
			"curve": 0,
			"vis": false,
			"color": "F8F8F8",
			"bCoef": 2,
			"cMask": [
				"ball"
			],
			"trait": "ballArea",
			"x": 557.5
		},
		{
			"v0": 46,
			"v1": 47,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 0
		},
		{
			"v0": 48,
			"v1": 49,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -550
		},
		{
			"v0": 50,
			"v1": 51,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 550
		},
		{
			"v0": 52,
			"v1": 53,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -381
		},
		{
			"v0": 54,
			"v1": 55,
			"curve": -90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 57,
			"v1": 56,
			"curve": -90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 58,
			"v1": 59,
			"curve": 90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 55,
			"v1": 59,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 61,
			"v1": 60,
			"curve": 90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 62,
			"v1": 63,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -240,
			"y": 123
		},
		{
			"v0": 64,
			"v1": 65,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -240,
			"y": 123
		},
		{
			"v0": 66,
			"v1": 67,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -240,
			"y": -123
		},
		{
			"v0": 68,
			"v1": 69,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -240,
			"y": -123
		},
		{
			"v0": 70,
			"v1": 71,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -381
		},
		{
			"v0": 73,
			"v1": 74,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 381
		},
		{
			"v0": 76,
			"v1": 75,
			"curve": -90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 78,
			"v1": 77,
			"curve": 90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 79,
			"v1": 80,
			"curve": 90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 81,
			"v1": 82,
			"curve": -90,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"v0": 83,
			"v1": 84,
			"curve": 0,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 390
		},
		{
			"v0": 86,
			"v1": 85,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 85,
			"v1": 86,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 88,
			"v1": 87,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 87,
			"v1": 88,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 90,
			"v1": 89,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 89,
			"v1": 90,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 92,
			"v1": 91,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 91,
			"v1": 92,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -375
		},
		{
			"v0": 94,
			"v1": 93,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 93,
			"v1": 94,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 96,
			"v1": 95,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 95,
			"v1": 96,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 98,
			"v1": 97,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 97,
			"v1": 98,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 100,
			"v1": 99,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 99,
			"v1": 100,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 375
		},
		{
			"v0": 102,
			"v1": 101,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 101,
			"v1": 102,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 104,
			"v1": 103,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 103,
			"v1": 104,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 106,
			"v1": 105,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 105,
			"v1": 106,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 108,
			"v1": 107,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 107,
			"v1": 108,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": -277.5
		},
		{
			"v0": 110,
			"v1": 109,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		},
		{
			"v0": 109,
			"v1": 110,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		},
		{
			"v0": 112,
			"v1": 111,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		},
		{
			"v0": 111,
			"v1": 112,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		},
		{
			"v0": 114,
			"v1": 113,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		},
		{
			"v0": 113,
			"v1": 114,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		},
		{
			"v0": 116,
			"v1": 115,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		},
		{
			"v0": 115,
			"v1": 116,
			"curve": 180,
			"vis": true,
			"color": "F8F8F8",
			"bCoef": 0.1,
			"trait": "line",
			"x": 277.5
		}
	],
	"goals": [
		{
			"p0": [
				-556.3,
				-80
			],
			"p1": [
				-556.3,
				80
			],
			"team": "red"
		},
		{
			"p0": [
				556.3,
				80
			],
			"p1": [
				556.3,
				-80
			],
			"team": "blue"
		}
	],
	"discs": [
		{
			"radius": 5,
			"pos": [
				-550,
				80
			],
			"color": "FF6666",
			"trait": "goalPost",
			"y": 80
		},
		{
			"radius": 5,
			"pos": [
				-550,
				-80
			],
			"color": "FF6666",
			"trait": "goalPost",
			"y": -80,
			"x": -560
		},
		{
			"radius": 5,
			"pos": [
				550,
				80
			],
			"color": "479BD8",
			"trait": "goalPost",
			"y": 80
		},
		{
			"radius": 5,
			"pos": [
				550,
				-80
			],
			"color": "479BD8",
			"trait": "goalPost",
			"y": -80
		},
		{
			"radius": 3,
			"invMass": 0,
			"pos": [
				-550,
				240
			],
			"color": "FFCC00",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"radius": 3,
			"invMass": 0,
			"pos": [
				-550,
				-240
			],
			"color": "FFCC00",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"radius": 3,
			"invMass": 0,
			"pos": [
				550,
				-240
			],
			"color": "FFCC00",
			"bCoef": 0.1,
			"trait": "line"
		},
		{
			"radius": 3,
			"invMass": 0,
			"pos": [
				550,
				240
			],
			"color": "FFCC00",
			"bCoef": 0.1,
			"trait": "line"
		}
	],
	"planes": [
		{
			"normal": [
				0,
				1
			],
			"dist": -240,
			"bCoef": 1,
			"trait": "ballArea",
			"vis": false,
			"curve": 0,
			"_data": {
				"extremes": {
					"normal": [
						0,
						1
					],
					"dist": -240,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						-350.0942371572802,
						-240
					],
					"b": [
						350.0942371572802,
						-240
					]
				}
			}
		},
		{
			"normal": [
				0,
				-1
			],
			"dist": -240,
			"bCoef": 1,
			"trait": "ballArea",
			"_data": {
				"extremes": {
					"normal": [
						0,
						-1
					],
					"dist": -240,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						-350.0942371572802,
						240
					],
					"b": [
						350.0942371572802,
						240
					]
				}
			}
		},
		{
			"normal": [
				0,
				1
			],
			"dist": -270,
			"bCoef": 0.1,
			"_data": {
				"extremes": {
					"normal": [
						0,
						1
					],
					"dist": -270,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						-350.0942371572802,
						-270
					],
					"b": [
						350.0942371572802,
						-270
					]
				}
			}
		},
		{
			"normal": [
				0,
				-1
			],
			"dist": -270,
			"bCoef": 0.1,
			"_data": {
				"extremes": {
					"normal": [
						0,
						-1
					],
					"dist": -270,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						-350.0942371572802,
						270
					],
					"b": [
						350.0942371572802,
						270
					]
				}
			}
		},
		{
			"normal": [
				1,
				0
			],
			"dist": -642,
			"bCoef": 0.1,
			"_data": {
				"extremes": {
					"normal": [
						1,
						0
					],
					"dist": -642,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						-642,
						-145.87259881553342
					],
					"b": [
						-642,
						145.87259881553342
					]
				}
			}
		},
		{
			"normal": [
				-1,
				0
			],
			"dist": -644,
			"bCoef": 0.1,
			"_data": {
				"extremes": {
					"normal": [
						-1,
						0
					],
					"dist": -644,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						644,
						-145.87259881553342
					],
					"b": [
						644,
						145.87259881553342
					]
				}
			}
		},
		{
			"normal": [
				1,
				0
			],
			"dist": -642,
			"bCoef": 0.1,
			"trait": "ballArea",
			"vis": false,
			"curve": 0,
			"_data": {
				"extremes": {
					"normal": [
						1,
						0
					],
					"dist": -642,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						-642,
						-145.87259881553342
					],
					"b": [
						-642,
						145.87259881553342
					]
				}
			}
		},
		{
			"normal": [
				-1,
				0
			],
			"dist": -643,
			"bCoef": 0.1,
			"trait": "ballArea",
			"vis": false,
			"curve": 0,
			"_data": {
				"extremes": {
					"normal": [
						-1,
						0
					],
					"dist": -643,
					"canvas_rect": [
						-350.0942371572802,
						-145.87259881553342,
						350.0942371572802,
						145.87259881553342
					],
					"a": [
						643,
						-145.87259881553342
					],
					"b": [
						643,
						145.87259881553342
					]
				}
			}
		}
	],
	"traits": {
		"ballArea": {
			"vis": false,
			"bCoef": 1,
			"cMask": [
				"ball"
			]
		},
		"goalPost": {
			"radius": 8,
			"invMass": 0,
			"bCoef": 0.5
		},
		"goalNet": {
			"vis": true,
			"bCoef": 0.1,
			"cMask": [
				"ball"
			]
		},
		"line": {
			"vis": true,
			"bCoef": 0.1,
			"cMask": [
				""
			]
		},
		"kickOffBarrier": {
			"vis": false,
			"bCoef": 0.1,
			"cGroup": [
				"redKO",
				"blueKO"
			],
			"cMask": [
				"red",
				"blue"
			]
		}
	},
	"playerPhysics": {
		"bCoef": 0,
		"acceleration": 0.11,
		"kickingAcceleration": 0.083,
		"kickStrength": 4.5,
		"radius": 15,
		"invMass": 0.5,
		"damping": 0.96,
		"cGroup": [
			"red",
			"blue"
		],
		"gravity": [
			0,
			0
		],
		"kickingDamping": 0.96,
		"kickback": 0
	},
	"ballPhysics": {
		"radius": 6.2,
		"bCoef": 0.4,
		"invMass": 1.6,
		"damping": 0.99,
		"color": "FF9214",
		"cMask": [
			"all"
		],
		"gravity": [
			0,
			0
		],
		"cGroup": [
			"ball"
		]
	},
	"cameraWidth": 0,
	"cameraHeight": 0,
	"maxViewWidth": 0,
	"cameraFollow": "ball",
	"redSpawnPoints": [],
	"blueSpawnPoints": [],
	"canBeStored": false,
	"kickOffReset": "partial",
	"joints": []
}`,

    "x4": `{
        "name": "Arena 4x4",
        "width": 755,
        "height": 339,
        "spawnDistance": 310,
        "bg": {
          "type": "hockey",
          "width": 665,
          "height": 290,
          "kickOffRadius": 80,
          "cornerRadius": 0
        },
        "vertexes": [
          {"x": -665, "y": 290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": -665, "y": 80, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": -665, "y": -80, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": -665, "y": -290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": 665, "y": 290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": 665, "y": 80, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": 665, "y": -80, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": 665, "y": -290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": 0, "y": 306, "trait": "kickOffBarrier"},
          {"x": 0, "y": 80, "trait": "kickOffBarrier"},
          {"x": 0, "y": -80, "trait": "line"},
          {"x": 0, "y": -306, "trait": "kickOffBarrier"},
          {"x": -693, "y": -80, "trait": "goalNet", "cMask": ["red", "blue", "ball"], "curve": -35, "color": "FFFFFF", "pos": [-693, -80], "vis": true},
          {"x": 693, "y": -80, "trait": "goalNet", "cMask": ["red", "blue", "ball"], "curve": 35, "color": "FFFFFF", "pos": [693, -80], "vis": true},
          {"x": -693, "y": 80, "trait": "goalNet", "cMask": ["red", "blue", "ball"], "curve": 35, "color": "FFFFFF", "pos": [-693, 80], "vis": true},
          {"x": 693, "y": 80, "trait": "goalNet", "cMask": ["red", "blue", "ball"], "curve": -35, "color": "FFFFFF", "pos": [693, 80], "vis": true},
          {"trait": "line", "x": -665, "y": -215},
          {"trait": "line", "x": -500, "y": -50},
          {"trait": "line", "x": 665, "y": -215},
          {"trait": "line", "x": 500, "y": -50},
          {"trait": "line", "x": -665, "y": 215},
          {"trait": "line", "x": -500, "y": 50},
          {"trait": "line", "x": 665, "y": 215},
          {"trait": "line", "x": 500, "y": 50},
          {"bCoef": 1, "trait": "ballArea", "x": 665, "y": 290, "cMask": ["ball"]},
          {"bCoef": 1, "trait": "ballArea", "x": 665, "y": -290, "cMask": ["ball"]},
          {"bCoef": 0, "trait": "line", "x": 0, "y": 290},
          {"bCoef": 0, "trait": "line", "x": 0, "y": -290},
          {"x": 0, "y": 80, "trait": "kickOffBarrier"},
          {"x": 0, "y": -80, "trait": "kickOffBarrier"},
          {"x": 674, "y": -80, "trait": "line", "cMask": ["ball"], "bCoef": 1},
          {"x": 674, "y": -290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": -674, "y": -80, "trait": "line", "cMask": ["ball"], "bCoef": 1},
          {"x": -674, "y": -290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": -674, "y": 80, "trait": "line", "cMask": ["ball"], "bCoef": 1},
          {"x": -674, "y": 290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1},
          {"x": 674, "y": 80, "trait": "line", "cMask": ["ball"], "bCoef": 1},
          {"x": 674, "y": 290, "trait": "ballArea", "cMask": ["ball"], "bCoef": 1}
        ],
        "segments": [
          {"v0": 0, "v1": 1, "trait": "ballArea"},
          {"v0": 2, "v1": 3, "trait": "ballArea"},
          {"v0": 4, "v1": 5, "trait": "ballArea"},
          {"v0": 6, "v1": 7, "trait": "ballArea"},
          {"v0": 8, "v1": 9, "trait": "kickOffBarrier"},
          {"v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": 180, "cGroup": ["blueKO"]},
          {"v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": -180, "cGroup": ["redKO"]},
          {"v0": 10, "v1": 11, "trait": "kickOffBarrier"},
          {"v0": 2, "v1": 12, "trait": "goalNet", "color": "FFFFFF", "curve": -35, "vis": true, "bCoef": 0.1, "cMask": ["ball"]},
          {"v0": 6, "v1": 13, "trait": "goalNet", "color": "FFFFFF", "curve": 35, "vis": true, "bCoef": 0.1, "cMask": ["ball"]},
          {"v0": 1, "v1": 14, "trait": "goalNet", "color": "FFFFFF", "curve": 35, "vis": true, "bCoef": 0.1, "cMask": ["ball"]},
          {"v0": 5, "v1": 15, "trait": "goalNet", "color": "FFFFFF", "curve": -35, "vis": true, "bCoef": 0.1, "cMask": ["ball"]},
          {"v0": 12, "v1": 14, "trait": "goalNet", "x": -585, "color": "FFFFFF", "curve": -35, "vis": true, "bCoef": 0.1, "cMask": ["ball"]},
          {"v0": 13, "v1": 15, "trait": "goalNet", "x": 585, "color": "FFFFFF", "curve": 35, "vis": true, "bCoef": 0.1, "cMask": ["ball"]},
          {"color": "FFFFFF", "trait": "line", "v0": 16, "v1": 17, "curve": 90},
          {"color": "FFFFFF", "trait": "line", "v0": 18, "v1": 19, "curve": -90},
          {"color": "FFFFFF", "trait": "line", "v0": 20, "v1": 21, "curve": -90},
          {"color": "FFFFFF", "trait": "line", "v0": 22, "v1": 23, "curve": 90},
          {"vis": true, "color": "FFFFFF", "bCoef": 0, "trait": "line", "v0": 17, "v1": 21, "curve": 0},
          {"vis": true, "color": "FFFFFF", "bCoef": 0, "trait": "line", "v0": 19, "v1": 23, "curve": 0},
          {"vis": true, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 1, "v1": 0, "cMask": ["ball"], "x": -665},
          {"vis": true, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 5, "v1": 4, "cMask": ["ball"], "x": 665},
          {"vis": true, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 2, "v1": 3, "cMask": ["ball"], "x": -665},
          {"vis": true, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 6, "v1": 7, "cMask": ["ball"], "x": 665},
          {"vis": true, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 0, "v1": 24, "y": 290},
          {"vis": true, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 3, "v1": 25, "y": -290},
          {"curve": 0, "vis": true, "color": "FFFFFF", "bCoef": 0, "trait": "line", "v0": 26, "v1": 27},
          {"curve": -180, "vis": true, "color": "FFFFFF", "bCoef": 0, "trait": "line", "v0": 10, "v1": 9},
          {"curve": 180, "vis": true, "color": "FFFFFF", "bCoef": 0, "trait": "line", "v0": 29, "v1": 28},
          {"curve": 0, "vis": true, "color": "FFFFFF", "bCoef": 0, "trait": "line", "v0": 2, "v1": 1},
          {"curve": 0, "vis": true, "color": "FFFFFF", "bCoef": 0, "trait": "line", "v0": 6, "v1": 5},
          {"vis": false, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 30, "v1": 31, "cMask": ["ball"], "x": 614},
          {"vis": false, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 32, "v1": 33, "cMask": ["ball"], "x": -614},
          {"vis": false, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 34, "v1": 35, "cMask": ["ball"], "x": -614},
          {"vis": false, "color": "FFFFFF", "bCoef": 1, "trait": "ballArea", "v0": 36, "v1": 37, "cMask": ["ball"], "x": 614}
        ],
        "goals": [
          {"p0": [-674, -80], "p1": [-674, 80], "team": "red"},
          {"p0": [674, 80], "p1": [674, -80], "team": "blue"}
        ],
        "discs": [
          {"pos": [-665, 80], "trait": "goalPost", "color": "FFFFFF", "radius": 5},
          {"pos": [-665, -80], "trait": "goalPost", "color": "FFFFFF", "radius": 5},
          {"pos": [665, 80], "trait": "goalPost", "color": "FFFFFF", "radius": 5},
          {"pos": [665, -80], "trait": "goalPost", "color": "FFFFFF", "radius": 5}
        ],
        "planes": [
          {"normal": [0, 1], "dist": -290, "trait": "ballArea"},
          {"normal": [0, -1], "dist": -290, "trait": "ballArea"},
          {"normal": [0, 1], "dist": -339, "bCoef": 0.2, "cMask": ["all"]},
          {"normal": [0, -1], "dist": -339, "bCoef": 0.2, "cMask": ["all"]},
          {"normal": [1, 0], "dist": -755, "bCoef": 0.2, "cMask": ["all"]},
          {"normal": [-1, 0], "dist": -755, "bCoef": 0.2, "cMask": ["all"]}
        ],
        "traits": {
          "ballArea": {"vis": false, "bCoef": 1, "cMask": ["ball"]},
          "goalPost": {"radius": 8, "invMass": 0, "bCoef": 1},
          "goalNet": {"vis": true, "bCoef": 0.1, "cMask": ["all"]},
          "kickOffBarrier": {"vis": false, "bCoef": 0.1, "cGroup": ["redKO", "blueKO"], "cMask": ["red", "blue"]},
          "line": {"vis": true, "bCoef": 0, "cMask": [""]},
          "arco": {"radius": 2, "cMask": ["n/d"], "color": "cccccc"}
        },
        "playerPhysics": {
          "acceleration": 0.11,
          "kickingAcceleration": 0.1,
          "kickStrength": 7
        },
        "ballPhysics": {
          "radius": 6.4,
          "color": "EAFF00"
        }
}`,
}

/* Configurações principais da SALA */

room.setScoreLimit(0);
room.setTimeLimit(3);
room.setTeamsLock(true);

/* Funções Primárias */

room.onGameStart = function () {
	room.sendAnnouncement(centerText(`🥅🥅 PARTIDA INICIANDO 🥅🥅`), null, welcomeColor, "bold", Notification.CHAT);
	room.sendAnnouncement(centerText(`${emojiHome} ${nameHome} X ${nameGuest} ${emojiGuest}`), null, welcomeColor, "bold", 0);

	for (let player of playerList) {
        if(player.isInTheRoom) {
            player.goals = 0;
            player.assists = 0;
            player.ownGoals = 0;
            player.points = 0;
        }
    }
    penultPlayerKick = undefined;
    lastPlayerKick = { id: 0, team: 0 };

	Hposs = 0;
	Gposs = 0;

    isHomeReserve = false;
    isGuestReserve = false;
	isGameRunning = true;
	OnOvertime = false;
	announcedOvertime = false;
	announcedNormal = false;
	checkTimeVariable = false;
	console.log("Tempo limite da partida:", room.getScores()?.timeLimit);
}

room.onGameStop = function(){
	isGameRunning = false
}

room.onPlayerJoin = function(player) {
    room.sendAnnouncement((`──────────────────────────────────────────────────────────────`), player.id, welcomeColor, "bold", Notification.CHAT)
    room.sendAnnouncement(centerText(`📢 Bem-vindo ${player.name}! digite "!ajuda" para a lista de comandos do server.`), player.id, welcomeColor, "bold", Notification.CHAT);
    room.sendAnnouncement((`──────────────────────────────────────────────────────────────`), player.id, welcomeColor, "bold", Notification.CHAT)
	playerAuth[player.id] = player.auth
	AddOrLoadPlayer(player);
}

room.onPlayerLeave = function(player){
	if(playerList[player.id - 1]) {
        playerList[player.id - 1].isInTheRoom = false;
        localStorage.setItem(player.auth, JSON.stringify(playerList[player.id - 1]));
    }
}

room.onPlayerChat = function(player, message) {
    let msgArray = message.split(/ +/)
    if (msgArray[0][0] === '!'){
        let command = getCommand(msgArray[0].slice(1).toLowerCase())
        console.log("Comando detectado:", command)
        if (command !== false) {
            commands[command].function(player, message)
            return false
        }
    }

	ColoredMessage(player, message)

	return false
}

room.onPlayerBallKick = function (player) {
	if (!lastPlayerKick || player.id !== lastPlayerKick.id || player.team !== lastPlayerKick.team) {
		penultPlayerKick = lastPlayerKick;
		lastPlayerKick = player;
	}
}

room.onTeamGoal = function (team) {
    const scores = room.getScores();
    const placar = centerText(`${emojiHome} ${nameHome} ${scores.red} - ${scores.blue} ${nameGuest} ${emojiGuest}`);
	const scorer = lastPlayerKick
	const assistant = (penultPlayerKick && penultPlayerKick.team === team && penultPlayerKick.id !== lastPlayerKick.id) ? penultPlayerKick : null;
	const isOwnGoal = scorer.team !== team

	if (!scorer){
		return
	}

	updatePlayerStatsOnGoal(scorer, assistant, isOwnGoal);

    if (!isOwnGoal) {
        room.sendAnnouncement(``, null, welcomeColor, "bold", Notification.CHAT);
        room.sendAnnouncement(centerText(`TOCA A MÚSICAAA, É GOOOOOL!!!`), null, welcomeColor, "bold", 0);
        room.sendAnnouncement(centerText(`⚽ Autor: ${scorer.name} ⚽`), null, welcomeColor, "bold", 0);
        room.sendAnnouncement(centerText(`Velocidade do Chute: ${ballSpeed.toFixed()}km/h`), null, welcomeColor, "bold", 0);

        setTimeout(() => {
            room.setPlayerAvatar(scorer.id, "⚽");
            setTimeout(() => {
                room.setPlayerAvatar(scorer.id, null);
            }, 2500);
        }, 1);
        setTimeout(() => {
            room.setPlayerAvatar(scorer.id, null);
        }, 2500);

        if (assistant) {
            room.sendAnnouncement(centerText(`👟 Assistência: ${penultPlayerKick.name}👟`), null, welcomeColor, "bold", 0);
            setTimeout(() => {
                room.setPlayerAvatar(penultPlayerKick.id, "👟");
                setTimeout(() => {
                    room.setPlayerAvatar(penultPlayerKick.id, null);
                }, 2500);
            }, 1);
            setTimeout(() => {
                room.setPlayerAvatar(penultPlayerKick.id, null);
            }, 2500);
        }
    } else {
        room.sendAnnouncement(``, null, welcomeColor, "bold", Notification.CHAT);
        room.sendAnnouncement(centerText(`🤦‍♂️ É pro outro lado ${scorer.name}! Gol Contra! 🤦‍♂️`), null, welcomeColor, "bold", 0);
        room.sendAnnouncement(centerText(`Velocidade do Chute: ${ballSpeed.toFixed()}km/h`), null, welcomeColor, "bold", 0);
        setTimeout(() => {
            room.setPlayerAvatar(scorer.id, "🤡");
            setTimeout(() => {
                room.setPlayerAvatar(scorer.id, null);
            }, 2500);
        }, 1);
        setTimeout(() => {
            room.setPlayerAvatar(scorer.id, null);
        }, 2500);
    }
	room.sendAnnouncement(placar, null, welcomeColor, "bold", Notification.CHAT);
}

room.onPlayerTeamChange = function (player) {
	if (teamChangeCooldown.has(player.id)) return

    if(player.id == 0) {

		if (IgnorarTrocaBot){
			IgnorarTrocaBot = false
			return
		}

        room.sendAnnouncement(`[⚠️] Você não pode colocar o bot para jogar!`, null , welcomeColor, "bold", Notification.CHAT);

		IgnorarTrocaBot = true
		room.setPlayerTeam(player.id, 0);
		return
    }

    if(afkPlayers.has(player.id)) {
		teamChangeCooldown.add(player.id)
        room.setPlayerTeam(player.id, 0);
        room.sendAnnouncement(`[⚠️] O jogador "${player.name}" está AFK`, player.id , welcomeColor, "bold", Notification.CHAT);
		setTimeout(() => {
			teamChangeCooldown.delete(player.id)
		}, 100)
		return
    }

	updateTeams();
}

room.onTeamVictory = function () {
	const scores = room.getScores();

	Hposs = Hposs / (Hposs + Gposs);
	Gposs = 1 - Hposs;

	room.sendAnnouncement(centerText(`🏆 FIM DE PARTIDA 🏆`), null, welcomeColor, "bold", Notification.CHAT);
	room.sendAnnouncement(centerText(`${emojiHome} ${nameHome} ${scores.red} - ${scores.blue} ${nameGuest} ${emojiGuest}`), null, welcomeColor, "bold", 0);
	room.sendAnnouncement(centerText(`${emojiHome} ` + (Hposs * 100).toPrecision(2).toString() + `%` + `  Posse de bola  ` + (Gposs * 100).toPrecision(2).toString() + `% ${emojiGuest}`), null, welcomeColor, "bold", 0);

	setTimeout(function () { 
		lastPlayerKick = { id: 0, team: 0 };
		penultPlayerKick = undefined;
	}, 8000);

	const mvp = calculateMVP();
    if (mvp) {
        room.sendAnnouncement(centerText(`[🏆] O MVP da partida foi: ${mvp.name} com ${mvp.points} pontos!`), null, welcomeColor, "bold", 0);
    }
}

room.onGameTick = function(){
	Prorrogração()
    getStats()
}

/* Funções auxiliares */

function getCommand(commandStr){
    if (commands.hasOwnProperty(commandStr)) return commandStr
    for (const [key, value] of Object.entries(commands)) {
        for (let i = 0; i < value.similar.length; i++) {
            if (value.similar[i] === commandStr) return key
        }
    }
    return false
}

function centerText(string) {
    var space = parseInt((80 - string.length) * 0.8, 10);
    if (space <= 0) {
        return '';
    }
    return ' '.repeat(space) + string + ' '.repeat(space);
};

function updateTeams() {
	let players = room.getPlayerList();
	playersTeamHome = players.filter(player => player.team === 1);
	playersTeamGuest = players.filter(player => player.team === 2);
	playersTeamEspec = players.filter(player => player.team === 0);
}

function getTime() {
	const scores = room.getScores();
	let min = parseInt(scores.time / 60);
	let sec = parseInt(scores.time) - min * 60;
	return `[${min}' ${sec}"]`
}

function getStats() {
	const ballPosition = room.getBallPosition();
	point[1] = point[0];
	point[0] = ballPosition;
	ballSpeed = pointDistance(point[0], point[1]) * speedCoefficient;
	lastPlayerKick.team == 1 ? Hposs++ : Gposs++;
}

function pointDistance(p1 , p2){
    let d1 = p1.x - p2.x
    let d2 = p1.y - p2.y
    return Math.sqrt(d1*d1 + d2*d2)
}

function instantRestart(){
    room.stopGame()
    setTimeout(() => {
        room.startGame()
        lastPlayerKick = {id: 0, team: 0}
        penultPlayerKick = {undefined}
        goalsHome = []
        goalsGuest = []
    }, 10)
}

function getUniform(uniformStr){
     if (uniforms.hasOwnProperty(uniformStr)){
        return uniformStr
     }
     for (const [key, value] of Object.entries(uniforms)){
        for (let i = 0; i < value.length; i++) {
            if (value.similar[i] === uniformStr){
                return key
            }
        }
     }
     return false
}

function changeUniforme(){
    let a = nameHome;
    nameHome = nameGuest;
    nameGuest = a;

    let b = acronymHome;
    acronymHome = acronymGuest;
    acronymGuest = b

    let c = emojiHome
    emojiHome = emojiGuest
    emojiGuest = c

    room.setTeamColors(1, uniforms[acronymHome].angle, uniforms[acronymHome].textcolor, [uniforms[acronymHome].color1, uniforms[acronymHome].color2, uniforms[acronymHome].color3])

    room.setTeamColors(2, uniforms[acronymGuest].angle, uniforms[acronymGuest].textcolor, [uniforms[acronymGuest].color1, uniforms[acronymGuest].color2, uniforms[acronymGuest].color3])
}

function CleanName(str) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "").toLowerCase().trim()
}

function MatchPlayerName(nameInput, playerlist){
	const inputClean = CleanName(nameInput)

	const exact = playerlist.find(p => CleanName(p.name) === inputClean)
	if (exact){
		return exact
	}

	const matches = playerlist.filter(p => CleanName(p.name).includes(inputClean))

	if (matches.length === 1){
		return matches[0]
	}

	if (matches.length > 1){
		return "ambíguo: " + matches.map(p => p.name).join(", ")
	}

	return null	
}

function Prorrogração(){
	const scores = room.getScores()
	if (Math.abs(scores.time - scores.timeLimit) <= 0.01 && scores.timeLimit != 0) {
		if (scores.red !== scores.blue) {
			if(checkTimeVariable === false) {
				checkTimeVariable = true
				setTimeout(() => {
					checkTimeVariable = false
				}, 3000)
				setTimeout(() => {
					room.stopGame()
				}, 2000)
			}
			return
		}
		if(OnOvertime === false) {
			OnOvertime = true
			announcedOvertime = false
			room.sendAnnouncement((`──────────────────────────────────────────────────────────────`), null, welcomeColor, "bold", Notification.CHAT)
			room.sendAnnouncement(centerText("[📢] PRORROGAÇÃO! Primeiro gol vence! ⚽"), null, welcomeColor, "bold", Notification.CHAT);
			room.sendAnnouncement((`──────────────────────────────────────────────────────────────`), null, welcomeColor, "bold", Notification.CHAT)
		}
	}
	if (scores.time > scores.timeLimit - 15 && !announcedNormal && !OnOvertime && scores.timeLimit > 0) {
		announcedNormal = true
		room.sendAnnouncement(centerText("[⌛] 15 segundos para o fim do tempo normal!"), null, welcomeColor, "bold", Notification.CHAT);
	}
	if (scores.time > scores.timeLimit + drawTimeLimit * 60 - 15 && !announcedOvertime && OnOvertime) {
			announcedOvertime = true
            room.sendAnnouncement(centerText("[⌛] 15 segundos para o empate!"), null, welcomeColor, "bold", Notification.CHAT);
    }
	if (scores.time > (scores.timeLimit + drawTimeLimit * 60)) {
        if (checkTimeVariable === false) {
            checkTimeVariable = true;
            setTimeout(() => { 
				checkTimeVariable = false; 
			}, 10);
            room.stopGame();
			OnOvertime = false
        }
    }
}

function ColoredMessage(player, message){
	let team = player.team

	if (player.id === 0) {
		return false
	}

	if (player.admin) {
		let ChatColor = commandsColor
		let CustomEmoji = "⭐"
		room.sendAnnouncement(`[${CustomEmoji}] ${player.name}: ${message}`, null, ChatColor, "normal")
	} else if (team === 1) {
		let ChatColor = 0xFF7438
		let CustomEmoji = "🔴"
		room.sendAnnouncement(`[${CustomEmoji}] ${player.name}: ${message}`, null, ChatColor, "normal")
	} else if (team === 2){
		let ChatColor = 0x2C6AC7
		let CustomEmoji = "🔵"
		room.sendAnnouncement(`[${CustomEmoji}] ${player.name}: ${message}`, null, ChatColor, "normal")
	} else {
		let ChatColor = 0xFFFFFF
		let CustomEmoji = ""
		room.sendAnnouncement(`${CustomEmoji} ${player.name}: ${message}`, null, ChatColor, "normal")
	}

	return false
}

function AddOrLoadPlayer(player){
	let stored = localStorage.getItem(player.auth)
	if (!stored){
		const obj = {
			auth: player.auth,
			id: player.id,
			name: player.name,
			goals: 0,
			assists: 0,
			ownGoals: 0,
			points: 0,
			isInTheRoom: true
		};
		localStorage.setItem(player.auth, JSON.stringify(obj))
		playerList[player.id - 1] = obj
	} else {
		let obj = JSON.parse(stored)
		obj.id = player.id
		obj.name = player.name
		obj.isInTheRoom = true
		playerList[player.id - 1] = obj
	}
}

function updatePlayerStatsOnGoal(scorer, assistant, isOwnGoal){
	if (!scorer) {
		return
	}

	let player = playerList[scorer.id - 1]

	if (!player){
		return
	}

	if (isOwnGoal) {
        player.ownGoals++;
        player.points -= 1;
    } else {
        player.goals++;
        player.points += 2;
        if (assistant && assistant.id !== scorer.id) {
            let assistPlayer = playerList.find(p => p.id === assistant.id);
            if (assistPlayer) {
                assistPlayer.assists++;
                assistPlayer.points += 1;
                localStorage.setItem(assistPlayer.auth, JSON.stringify(assistPlayer));
            }
        }
    }

    localStorage.setItem(player.auth, JSON.stringify(player));
}

function calculateMVP() {
    let mvp = null;
    for (let player of playerList) {
        if (!player.isInTheRoom) continue;
        if (!mvp || player.points > mvp.points || (player.points === mvp.points && player.assists > mvp.assists)) {
            mvp = player;
        }
    }
    return mvp;
}

/* Funções dos comandos */

function helpCommand(player, message) {
    let msgArray = message.split(/ +/).splice(1)
    if (msgArray.length === 0){
        let commandString = "[</>] LISTA DE COMANDOS DO SERVER: "
        commandString += "\n\nComandos de Players: "
        for (const [key, value] of Object.entries(commands)){
            if(value.desc && value.roles === Role.PLAYER) {
                commandString += `!${key}, `
            }
        }
        commandString = commandString.replace(/[,.\s]+$/, "") + ".";
        if (player.admin){
            commandString += "\n\nComandos de Adminstradores: "
            for(const [key, value] of Object.entries(commands)){
                if(value.desc && value.roles === Role.ADMIN){
                    commandString += `!${key}, `
                }
            }
        }
        commandString = commandString.replace(/[,.\s]+$/, "") + ".";
        if (commandString.slice(commandString.length - 1) === ":") commandString += ` None,`;
		commandString = commandString.substring(0, commandString.length - 1) + ".";
        commandString += "\n\n[📢] Para obter informações sobre um comando em específico, digite '\'!ajuda <nome do comando>'\'.";
		room.sendAnnouncement(commandString, player.id, commandsColor, "bold", Notification.CHAT);
    }
    else if (msgArray.length >= 1) {
		let commandName = getCommand(msgArray[0].toLowerCase());
		if (commandName !== false && commands[commandName].desc !== false) room.sendAnnouncement(`[PV] Comando \'${commandName}\' :\n${commands[commandName].desc}`, player.id, welcomeColor, "bold", Notification.CHAT);
		else room.sendAnnouncement(`[❌] Esse comando não existe. Para olhar a lista de comandos digite \'!ajuda\'`, player.id, commandsColor, "bold", Notification.CHAT);
	}
}

function uniformCommand (player,message) { 
    let msgArray = message.split(/ +/).splice(1)
    if (msgArray.length === 0 ){

		if (!player.admin){
            room.sendAnnouncement(`[⚠️] Apenas admins podem modificar os uniformes dos times.`, player.id, welcomeColor, "bold", Notification.CHAT);
            return;
        }

        let uniformString = "[🌎] Clubes Sulamericanos :"
        for (const [key, value] of Object.entries(uniforms)){
            if (value.type === Uniform.CLUBSA) {
                uniformString += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString += `\n`
        room.sendAnnouncement(uniformString, player.id, welcomeColor, "bold", Notification.CHAT)
        let uniformString2 = "[🌍] Clubes Europeus :"
        for (const [key, value] of Object.entries(uniforms)) {
            if (value.type === Uniform.CLUBEU) {
                uniformString2 += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString2 += `\n`
        room.sendAnnouncement(uniformString2, player.id, welcomeColor, "bold", Notification.CHAT)
        let uniformString3 = "[🌐] Clubes Custom :"
        for (const [key, value] of Object.entries(uniforms)){
            if (value.type === Uniform.CLUBCS){
                uniformString3 += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString3 += `\n`
        room.sendAnnouncement(uniformString3, player.id, welcomeColor, "bold", Notification.CHAT)
        room.sendAnnouncement(`[☝️] Para escolher um uniforme para seu time digite "!uniforme <red/blue> + <sigla do time>".`, player.id, welcomeColor, "bold", Notification.CHAT)
    } else if (msgArray.length < 2){
        room.sendAnnouncement(`[❌] Uso incorreto. Use "!uniforme <red/blue> + <sigla do time>".`, player.id, welcomeColor, "bold", Notification.CHAT);
        return;
    } else {
        let uniformName = getUniform(msgArray[1].toLowerCase())
        let uniform = uniforms[uniformName];
        let targetTeam = player.team
        let teamColor = msgArray[0].toLowerCase()

        if (!player.admin){
            room.sendAnnouncement(`[⚠️] Apenas admins podem modificar os uniformes dos times.`, player.id, welcomeColor, "bold", Notification.CHAT);
            return;
        }

		if (!isGameRunning) {
			room.sendAnnouncement(`[❌] O jogo ainda não começou. Não é possível colocar uniformes agora.`, player.id, welcomeColor, "bold", Notification.CHAT);
			return;
		}

        if (teamColor !== "red" && teamColor !== "blue"){
            room.sendAnnouncement(`[❌] Uso incorreto. Use '\'!uniforme <red/blue> + <sigla do time>\'.`, player.id, welcomeColor, "bold", Notification.CHAT)
            return
        }

        if (!uniform) {
            room.sendAnnouncement(`[⚠️] Esse uniforme não existe. Digite '!uniforme' para ver os disponíveis.`, player.id, welcomeColor, "bold", Notification.CHAT);
            return;
        }

        if (msgArray.length >= 2) {
            if (teamColor === "red") {
                targetTeam = 1
            } else if (teamColor === "blue") {
                targetTeam = 2
            }
        }

    room.sendAnnouncement(`[📢] O uniforme do \'${uniform.name}\' foi colocado no time ${targetTeam === 1 ? "Red" : "Blue"}`, player.id, welcomeColor, "bold", Notification.CHAT);
    room.setTeamColors(targetTeam, uniforms[uniformName].angle, uniforms[uniformName].textcolor, [uniforms[uniformName].color1, uniforms[uniformName].color2, uniforms[uniformName].color3])

        if (targetTeam == 1){
            nameHome = uniforms[uniformName].name;
            acronymHome = uniformName;
            emojiHome = uniforms[uniformName].emoji;
        } else if (targetTeam == 2){
            nameGuest = uniforms[uniformName].name;
            acronymGuest = uniformName;
            emojiGuest = uniforms[uniformName].emoji;
        }
    }  

}

function reserveCommand(player, message){
	let msgArray = message.split(/ +/).splice(1)

	if (msgArray.length !== 2) {
		room.sendAnnouncement(`[❌] Uso incorreto. Use "!reserva <red/blue> + <sigla do time>".`, player.id, welcomeColor, "bold", Notification.CHAT);
		return;
	}

	if (!player.admin){
		room.sendAnnouncement(`[⚠️] Apenas admins podem modificar os uniformes dos times.`, player.id, welcomeColor, "bold", Notification.CHAT);
		return;
	}

	if (!isGameRunning) {
		room.sendAnnouncement(`[❌] O jogo ainda não começou. Não é possível mudar uniformes agora.`, player.id, welcomeColor, "bold", Notification.CHAT);
		return;
	}

	let teamColor = msgArray[0].toLowerCase()
	if (teamColor !== "red" && teamColor !== "blue"){
		room.sendAnnouncement(`[❌] Uso incorreto. Use "!reserva <red/blue>".`, player.id, welcomeColor, "bold", Notification.CHAT)
        return;
	}

	let uniformName = getUniform(msgArray[1].toLowerCase())
 	let uniform = uniforms[uniformName];
	let targetTeam = (teamColor === "red") ? 1 : 2

	if (!uniform) {
		room.sendAnnouncement(`[⚠️] Esse uniforme não existe. Digite '!uniforme' para ver os disponíveis.`, player.id, welcomeColor, "bold", Notification.CHAT);
		return;
	}

	if (targetTeam === 1 && acronymHome !== uniformName) {
		room.sendAnnouncement(`[❌] O uniforme principal do time Red não foi definido. Use "!uniforme red <sigla>" primeiro.`, player.id, welcomeColor, "bold", Notification.CHAT);
		return;
	}
	if (targetTeam === 2 && acronymGuest !== uniformName) {
		room.sendAnnouncement(`[❌] O uniforme principal do time Blue não foi definido. Use "!uniforme blue <sigla>" primeiro.`, player.id, welcomeColor, "bold", Notification.CHAT);
		return;
	}

	if (targetTeam == 1){
		if (!isHomeReserve){
			room.setTeamColors(targetTeam, uniforms[uniformName].angle2, uniforms[uniformName].textcolor2, [uniforms[uniformName].color21, uniforms[uniformName].color22, uniforms[uniformName].color23])
			room.sendAnnouncement(`[📢] O uniforme reserva do "${nameHome}" foi aplicado.`, player.id, welcomeColor, "bold", Notification.CHAT);
			isHomeReserve = true
		} else {
			room.setTeamColors(targetTeam, uniforms[uniformName].angle, uniforms[uniformName].textcolor, [uniforms[uniformName].color1, uniforms[uniformName].color2, uniforms[uniformName].color3]);
			room.sendAnnouncement(`[📢] O uniforme principal do "${nameHome}" foi restaurado.`, player.id, welcomeColor, "bold", Notification.CHAT);
			isHomeReserve = false;
		}
	} else if (targetTeam == 2){
		if (!isGuestReserve) {
			room.setTeamColors(targetTeam, uniforms[uniformName].angle2, uniforms[uniformName].textcolor2, [uniforms[uniformName].color21, uniforms[uniformName].color22, uniforms[uniformName].color23])
			room.sendAnnouncement(`[📢] Uniforme reserva do '${nameGuest}' aplicado.`, player.id, welcomeColor, "bold", Notification.CHAT);
			isGuestReserve = true
		} else {
			room.setTeamColors(targetTeam, uniforms[uniformName].angle, uniforms[uniformName].textcolor, [uniforms[uniformName].color1, uniforms[uniformName].color2, uniforms[uniformName].color3]);
			room.sendAnnouncement(`[📢] Uniforme principal do '${nameGuest}' restaurado.`, player.id, welcomeColor, "bold", Notification.CHAT);
			isGuestReserve = false;
		}
	}
}	

function restartCommand(player, message){

	if (!player.admin) {
		room.sendAnnouncement(`[⚠️] Apenas administradores podem usar esse comando`, player.id, welcomeColor, "bold", Notification.CHAT)
        return;
	}

	let scores = room.getScores()

	if (!scores){
		room.sendAnnouncement(`[⚠️] A partida ainda não começou. Não há o que reiniciar.`, player.id, welcomeColor, "bold", Notification.CHAT)
        return;
	}

	instantRestart()
    room.sendAnnouncement(`[📣] "${player.name}" reiniciou a partida!`, null, welcomeColor, "bold", Notification.CHAT)
}

function adminCommand(player, message) {
    let msgArray = message.split(/ +/).slice(1)

	if (msgArray.length === 0){
		room.sendAnnouncement(`[📣] Digite a senha após o comando. !admin <senha>`, player.id, welcomeColor, "bold", Notification.CHAT)
		return
	}

    if (msgArray.length === 1 && msgArray[0] === adminPassword){

		if (player.admin) {
			room.sendAnnouncement(`[⚠️] Você já é admin.`, player.id, welcomeColor, "bold", Notification.CHAT)
			return
		}

        room.setPlayerAdmin(player.id, true)
        authWhiteList.push(playerAuth[player.id])
        room.sendAnnouncement(`[📣] ${player.name} agora é admin da sala!`, null, welcomeColor, "bold", Notification.CHAT)
        return
    }

    if (player.admin){
        let targetName = msgArray[0].toLowerCase()

		if (targetName.length < 3) {
			room.sendAnnouncement(`[❌] Especifique, pelo menos, 3 letras do nome.`, player.id, welcomeColor, "bold", Notification.CHAT)
			return
		}

        let players = room.getPlayerList()
        let matches = players.filter(p => p.name.toLowerCase().startsWith(targetName))

        if (matches.length === 1){
            let target = matches[0]

			if (target.admin) {
				room.sendAnnouncement(`[❌] O jogador "${target.name}" já é admin.`, player.id, welcomeColor, "bold", Notification.CHAT)
				return
			}

			room.setPlayerAdmin(target.id, true)
            authWhiteList.push(playerAuth[target.id])
            room.sendAnnouncement(`[📣] "${target.name}" agora é admin da sala! Concebido por "${player.name}".`, null, welcomeColor, "bold", Notification.CHAT)
        } else if (matches.length > 1){
            room.sendAnnouncement(`[❌] Mais de um jogador corresponde ao nick: "${msgArray[0]}". Seja mais específico!`, player.id, welcomeColor, "bold", Notification.CHAT)
        } else {
            room.sendAnnouncement(`[❌] Nenhum jogador corresponde ao nick: "${msgArray[0]}".`, player.id, welcomeColor, "bold", Notification.CHAT)
        }
		return
	} 

	room.sendAnnouncement(`[❌] Senha errada.`, player.id, welcomeColor, "bold", Notification.CHAT)
}

function unadminCommand(player, message) {
    let msgArray = message.split(/ +/).slice(1)

	if (!player.admin){
		room.sendAnnouncement(`[⚠️] Apenas administradores podem usar esse comando`, player.id, welcomeColor, "bold", Notification.CHAT)
        return;
	}

	if (msgArray.length === 0){
		room.sendAnnouncement(`[📣] Digite um nome de alguém que tenha ADMIN após o comando. !unadmin <nome>`, player.id, welcomeColor, "bold", Notification.CHAT)
		return
	}

    if (player.admin){
        let players = room.getPlayerList()
        let targetName = msgArray[0].toLowerCase()
        let matches = players.filter(p => p.name.toLowerCase().includes(targetName))

        if (matches.length === 1){
			let target = matches[0]

			if (!target.admin){
				room.sendAnnouncement(`[❌] O jogador "${target.name}" já não é admin.`, player.id, welcomeColor, "bold", Notification.CHAT)
                return
			}

            room.setPlayerAdmin(target.id, false)
			authWhiteList.push(playerAuth[target.id])
            room.sendAnnouncement(`[📣] "${target.name}" deixou de ser admin da sala! Retirado por ${player.name}.`, null, welcomeColor, "bold", Notification.CHAT)
        } else if (matches.length > 1){
            room.sendAnnouncement(`[❌] Mais de um jogador corresponde ao nick "${msgArray[0]}". Seja mais específico!`, player.id, welcomeColor, "bold", Notification.CHAT)
        } else {
            room.sendAnnouncement(`[❌] Nenhum jogador corresponde ao nick "${msgArray[0]}".`, player.id, welcomeColor, "bold", Notification.CHAT)
        }
		return
	}

	room.sendAnnouncement(`[❌] Você não tem permissão para usar este comando!`, player.id, welcomeColor, "bold", Notification.CHAT)
}

function leaveCommand(player, message){
    room.kickPlayer(player.id, "Tchau!", false)
    room.sendAnnouncement(`[📣] O jogador "${player.name}" saiu da sala!`, null, welcomeColor, "bold", Notification.CHAT)
}

function roomCommand(player, message){
    let msgArray = message.split(/ +/).slice(1)

    if (!player.admin) {
        room.sendAnnouncement(`[⚠️] Apenas administradores podem usar esse comando`, player.id, welcomeColor, "bold", Notification.CHAT)
        return;
    }

    if (msgArray.length === 0){
        let RoomString = "[🏟️] Salas disponíveis: "
        for(const [key] of Object.entries(mapas)) {
            RoomString += `\n !sala ${key}`
        }
        RoomString += '\n'
        room.sendAnnouncement(RoomString, player.id, welcomeColor, "bold", Notification.CHAT)
        return
    }

    if (room.getScores() !== null){
        room.sendAnnouncement(`[❌] Não é possível trocar o mapa durante uma partida em andamento.`, player.id, welcomeColor, "bold", Notification.CHAT);
        return;
    }

    let nome = msgArray[0].toLowerCase()

    if (!mapas[nome]) {
        room.sendAnnouncement(`[❌] O mapa "${nome}" não existe.`, player.id, welcomeColor, "bold", Notification.CHAT)
        return;
    }

    let MapaJSON = JSON.parse(mapas[nome])

    room.setDefaultStadium("Classic");

    if (mapas[nome]){
        setTimeout(() => {
            room.setCustomStadium(mapas[nome])
            mapaAtual = nome
            room.sendAnnouncement(`[📣] O mapa foi trocado para "${MapaJSON.name}" por "${player.name}"`, null, welcomeColor, "bold", Notification.CHAT)
        }, 100);
    } else {
        room.sendAnnouncement(`[❌] O mapa "${nome}" não existe.`, player.id, welcomeColor, "bold", Notification.CHAT)
    }
}

function afkCommand(player, message) {
    const isAFK = afkPlayers.has(player.id)

    if (player.team === 1 || player.team === 2) {
        room.sendAnnouncement(`[❌] Você não pode ativar AFK enquanto está em jogo ou estiver em um time.`, player.id, welcomeColor, "bold", Notification.CHAT);
        return;
    }

    if (isAFK){
        afkPlayers.delete(player.id)
        room.sendAnnouncement(`[🔆] O jogador "${player.name}" acordou!`, null, welcomeColor, "bold", Notification.CHAT);
    } else {
        afkPlayers.add(player.id);
        room.setPlayerTeam(player.id, 0);
        room.sendAnnouncement(`[💤] O jogador "${player.name}" ficou AFK!`, null, welcomeColor, "bold", Notification.CHAT);
    }
}