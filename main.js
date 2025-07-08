/* Configurações primordiais da SALA */

let room = HBInit ({
    roomName: "Teste",
    maxPlayers: 16,
    noPlayer: true,
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
let undefeatedScore = 0;
let players;
let numberEachTeam;
let isHomeReserve = false;
let isGuestReserve = false;

/* Cores */

let announcementColor = 0xfffafa;
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
    "time": {
        "similar": ['team', 'tm'],
        "roles": Role.ADMIN,
        "desc": `Este comando define os times da sala.`,
        "function": teamCommand,
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

/* Configurações principais da SALA */

room.setScoreLimit(0);
room.setTimeLimit(3);
room.setTeamsLock(true);

/* Funções Primárias */

room.onGameStart = function () {
	room.sendAnnouncement(centerText(`🥅🥅 PARTIDA INICIANDO 🥅🥅`), null, announcementColor, "bold", Notification.CHAT);
	room.sendAnnouncement(centerText(`${emojiHome} ${nameHome} X ${nameGuest} ${emojiGuest}`), null, announcementColor, "bold", 0);

	if (undefeatedScore !== 0) {
		room.sendAnnouncement(centerText(`     📢 ${nameHome} está invicto 📢`), null, announcementColor, "bold", 0);
		room.sendAnnouncement(centerText(`     📢 Sequência de ${undefeatedScore} jogo(s) 📢`), null, announcementColor, "bold", 0);
	}

	Hposs = 0;
	Gposs = 0;
    isHomeReserve = false;
    isGuestReserve = false;
}

room.onPlayerJoin = function(player) {
    room.sendAnnouncement((`──────────────────────────────────────────────────────────────`), player.id, welcomeColor, "bold", Notification.CHAT)
    room.sendAnnouncement(centerText(`📢 Bem-Vindo ${player.name}! digite "!ajuda" para a lista de comandos do server.`), player.id, welcomeColor, "bold", Notification.CHAT);
    room.sendAnnouncement((`──────────────────────────────────────────────────────────────`), player.id, welcomeColor, "bold", Notification.CHAT)
    let players = room.getPlayerList()
    if(players.length < 7){
        numberEachTeam = parseInt(players.length / 2)
    } else {
        numberEachTeam = 3;
    }
}

room.onPlayerLeave = function(player) {
    let players = room.getPlayerList()
    if(players.length < 7){
        numberEachTeam = parseInt(players.length / 2)
    } else {
        numberEachTeam = 3;
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
}

room.onPlayerBallKick = function (player) {
	if (player.id !== lastPlayerKick.id || player.team !== lastPlayerKick.team) {
		penultPlayerKick = lastPlayerKick;
		lastPlayerKick = player;
	}
}

room.onTeamGoal = function (team) {
    const goalTime = getTime()
    const scores = room.getScores()
    if (lastPlayerKick.team === team) {
		room.sendAnnouncement(``, null, announcementColor, "bold", Notification.CHAT);
		room.sendAnnouncement(centerText(`TOCA A MÚSICAAA, É GOOOOOL!!!`), null, announcementColor, "bold", 0);
		room.sendAnnouncement(centerText(`⚽ Autor: ${lastPlayerKick.name} ⚽`), null, announcementColor, "bold", 0);
		room.sendAnnouncement(centerText(`Velocidade do Chute: ${ballSpeed.toFixed()}km/h`), null, announcementColor, "bold", 0);
        room.setPlayerAvatar(lastPlayerKick.id, '⚽');
		setTimeout(function () { room.setPlayerAvatar(lastPlayerKick.id,); }, 2400);

		if (penultPlayerKick.team === team) {
			room.sendAnnouncement(centerText(`👟 Assistência: ${penultPlayerKick.name}👟`), null, announcementColor, "bold", 0);
			room.setPlayerAvatar(penultPlayerKick.id, '👟');
			setTimeout(function () { room.setPlayerAvatar(penultPlayerKick.id,); }, 2400);
		}

		if (team === 1) {
			goalsHome.push(`${lastPlayerKick.name}  ${goalTime}`);
		} else if (team === 2) {
			goalsGuest.push(`${lastPlayerKick.name}  ${goalTime}`);
		}

	} else {
		room.sendAnnouncement(``, null, announcementColor, "bold", Notification.CHAT);
		room.sendAnnouncement(centerText(`🤦‍♂️ Boa seu merda! Gol Contra! 🤦‍♂️`), null, announcementColor, "bold", 0);
		room.sendAnnouncement(centerText(`🤡 Autor: ${lastPlayerKick.name} 🤡`), null, announcementColor, "bold", 0);
		room.sendAnnouncement(centerText(`Velocidade do Chute: ${ballSpeed.toFixed()}km/h`), null, announcementColor, "bold", 0);
		room.setPlayerAvatar(lastPlayerKick.id, '🤡');
		setTimeout(function () { room.setPlayerAvatar(lastPlayerKick.id,); }, 2400);

		if (team === 1) {
			goalsHome.push(`${lastPlayerKick.name} (C)  ${goalTime}`);
		} else if (team === 2) {
			goalsGuest.push(`${lastPlayerKick.name} (C)  ${goalTime}`);
		}
	}
	room.sendAnnouncement(centerText(`${emojiHome} ${nameHome} ${scores.red} - ${scores.blue} ${nameGuest} ${emojiGuest}`), null, announcementColor, "bold", 0);
}

room.onPlayerTeamChange = function () {
	updateTeams();
}

room.onTeamVictory = function () {
	const scores = room.getScores();

	Hposs = Hposs / (Hposs + Gposs);
	Gposs = 1 - Hposs;

	room.sendAnnouncement(centerText(`🏆 FIM DE PARTIDA 🏆`), null, announcementColor, "bold", Notification.CHAT);
	room.sendAnnouncement(centerText(`${emojiHome} ${nameHome} ${scores.red} - ${scores.blue} ${nameGuest} ${emojiGuest}`), null, 0x0000FF, "bold", 0);
	room.sendAnnouncement(centerText(`${emojiHome} ` + (Hposs * 100).toPrecision(2).toString() + `%` + `  Posse de bola  ` + (Gposs * 100).toPrecision(2).toString() + `% ${emojiGuest}`), null, announcementColor, "bold", 0);

	for (let i = 0; i < 3; i++) {
		room.sendAnnouncement(docketFormat(goalsHome[i], goalsGuest[i]), null, announcementColor, "bold", 0);
	}

	if (scores.red > scores.blue) {
		setTimeout(function () {
			for (let i = 0; i < playersTeamGuest.length; i++) {
				room.setPlayerTeam(playersTeamGuest[i].id, 0);
			}
		}, 6000);

		setTimeout(function () {
			for (let i = 0; i < numberEachTeam; i++) {
				room.setPlayerTeam(playersTeamEspec[i].id, 2);
			}
		}, 7000);

		undefeatedScore++;
		setTimeout(function () { room.startGame(); }, 9000);

	} else {
		setTimeout(function () {
			for (let i = 0; i < playersTeamHome.length; i++) {
				room.setPlayerTeam(playersTeamHome[i].id, 0);
			}
		}, 6000);

		setTimeout(function () {
			for (let i = 0; i < playersTeamGuest.length; i++) {
				room.setPlayerTeam(playersTeamGuest[i].id, 1);
			}
		}, 7000);

		setTimeout(function () {
			for (let i = 0; i < numberEachTeam; i++) {
				room.setPlayerTeam(playersTeamEspec[i].id, 2);
			}
		}, 8000);

		undefeatedScore = 0;
		undefeatedScore++;

		setTimeout(function () { changeUniforme(); }, 8000);

		setTimeout(function () { room.startGame(); }, 9000);
	}

	setTimeout(function () { 
		lastPlayerKick = { id: 0, team: 0 };
		penultPlayerKick = undefined;
		goalsHome = [];
		goalsGuest = [];
	}, 8000);
	
}

room.onGameTick = function(){
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
function docketFormat(string1, string2) {
	if (string1 !== undefined && string2 === undefined) {
		let space = 53 - (string1.length) * 0.8;
		return ' '.repeat(space) + string1
	} else if (string2 !== undefined && string1 === undefined) {
		return ' '.repeat(77) + string2
	} else if (string2 !== undefined && string1 !== undefined) {
		let space = 16 - (string1.length + 10 + string2.length)
		return ' '.repeat(12) + centerText(string1 + ' '.repeat(10) + string2)
	} else if (string1 === undefined && string2 === undefined) {
		return ''
	}
}

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

    let c = emojihome
    emojihome = emojiGuest
    emojiGuest = c

    room.setTeamColors(1, uniforms[acronymHome].angle, uniforms[acronymHome].textcolor, [uniforms[acronymHome].color1, uniforms[acronymHome].color2, uniforms[acronymHome].color3])

    room.setTeamColors(2, uniforms[acronymGuest].angle, uniforms[acronymGuest].textcolor, [uniforms[acronymGuest].color1, uniforms[acronymGuest].color2, uniforms[acronymGuest].color3])
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
		if (commandName !== false && commands[commandName].desc !== false) room.sendAnnouncement(`[PV] Comando \'${commandName}\' :\n${commands[commandName].desc}`, player.id, announcementColor, "bold", Notification.CHAT);
		else room.sendAnnouncement(`[PV] Esse comando não existe. Para olhar a lista de comandos digite \'!ajuda\'`, player.id, announcementColor, "bold", Notification.CHAT);
	}
}

function uniformCommand (player,message) { 
    let msgArray = message.split(/ +/).splice(1)
    if (msgArray.length === 0 ){
        let uniformString = "[PV] Clubes Sulamericanos :"
        for (const [key, value] of Object.entries(uniforms)){
            if (value.type === Uniform.CLUBSA) {
                uniformString += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString += `\n`
        room.sendAnnouncement(uniformString, player.id, announcementColor, "bold", Notification.CHAT)
        let uniformString2 = "[PV] Clubes Europeus"
        for (const [key, value] of Object.entries(uniforms)) {
            if (value.type === Uniform.CLUBEU) {
                uniformString2 += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString2 += `\n`
        room.sendAnnouncement(uniformString2, player.id, announcementColor, "bold", Notification.CHAT)
        let uniformString3 = "[PV] Clubes Custom"
        for (const [key, value] of Object.entries(uniforms)){
            if (value.type === Uniform.CLUBCS){
                uniformString3 += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString3 += `\n`
        room.sendAnnouncement(uniformString3, player.id, announcementColor, "bold", Notification.CHAT)
        room.sendAnnouncement(`[☝️] Para escolher um uniforme para seu time digite '\'!uniforme <sigla do time>\'.`, player.id, welcomeColor, "bold", Notification.CHAT)
    } else if (msgArray.length < 2){
        room.sendAnnouncement(`[PV] Uso incorreto. Use '\'!uniforme <red/blue> + <sigla do time>\'.`, player.id, welcomeColor, "bold", Notification.CHAT);
        return;
    } else {
        let uniformName = getUniform(msgArray[1].toLowerCase())
        let uniform = uniforms[uniformName];
        let targetTeam = player.team
        let teamColor = msgArray[0].toLowerCase()

        if (!player.admin){
            room.sendAnnouncement(`[PV] Apenas admins podem modificar os uniformes dos times.`, player.id, welcomeColor, "bold", Notification.CHAT);
            return;
        }

        if (teamColor !== "red" && teamColor !== "blue"){
            room.sendAnnouncement(`[PV] Uso incorreto. Use '\'!uniforme <red/blue> + <sigla do time>\'.`, player.id, welcomeColor, "bold", Notification.CHAT)
            return
        }

        if (!uniform) {
            room.sendAnnouncement(`[PV] Esse uniforme não existe. Digite '!uniforme' para ver os disponíveis.`, player.id, welcomeColor, "bold", Notification.CHAT);
            return;
        }

        if (msgArray.length >= 2) {
            if (teamColor === "red") {
                targetTeam = 1
            } else if (teamColor === "blue") {
                targetTeam = 2
            }
        }

    room.sendAnnouncement(`[PV] O uniforme do \'${uniform.name}\' foi colocado no time ${targetTeam === 1 ? "RED" : "BLUE"}`, player.id, announcementColor, "bold", Notification.CHAT);
    room.setTeamColors(targetTeam, uniforms[uniformName].angle, uniforms[uniformName].textcolor, [uniforms[uniformName].color1, uniforms[uniformName].color2, uniforms[uniformName].color3])

        if (targetTeam == 1){
            nameHome = uniforms[uniformName].name;
            acronymHome = uniformName;
            emojihome = uniforms[uniformName].emoji;
        } else if (targetTeam == 2){
            nameGuest = uniforms[uniformName].name;
            acronymGuest = uniformName;
            emojiGuest = uniforms[uniformName].emoji;
        }
    }  

}


function reserveCommand(player){
    if (player.team === 1){
        if (!isHomeReserve){
            room.setTeamColors(player.team, uniforms[acronymHome].angle2, uniforms[acronymHome].textcolor2, [uniforms[acronymHome].color21, uniforms[acronymHome].color22, uniforms[acronymHome].color23])
            room.sendAnnouncement(`[PV] Uniforme reserva do "${nameHome}" aplicado.`, player.id, announcementColor, "bold", Notification.CHAT);
            isHomeReserve = true
        } else {
            room.setTeamColors(player.team, uniforms[acronymHome].angle, uniforms[acronymHome].textcolor, [uniforms[acronymHome].color1, uniforms[acronymHome].color2, uniforms[acronymHome].color3]);
            room.sendAnnouncement(`[PV] Uniforme principal do "${nameHome}" restaurado.`, player.id, announcementColor, "bold", Notification.CHAT);
            isHomeReserve = false;
        }
    }

    if (player.team === 2){
        if (!isGuestReserve) {
            room.setTeamColors(player.team, uniforms[acronymGuest].angle2, uniforms[acronymGuest].textcolor2, [uniforms[acronymGuest].color21, uniforms[acronymGuest].color22, uniforms[acronymGuest].color23])
            room.sendAnnouncement(`[PV] Uniforme reserva do '${nameGuest}' aplicado.`, player.id, announcementColor, "bold", Notification.CHAT);
            isGuestReserve = true
        } else {
            room.setTeamColors(player.team, uniforms[acronymGuest].angle, uniforms[acronymGuest].textcolor, [uniforms[acronymGuest].color1, uniforms[acronymGuest].color2, uniforms[acronymGuest].color3]);
            room.sendAnnouncement(`[PV] Uniforme principal do '${nameGuest}' restaurado.`, player.id, announcementColor, "bold", Notification.CHAT);
            isGuestReserve = false;
        }
    }
}

function restartCommand(player, message){
    if (player.admin) {
        instantRestart()
        room.sendAnnouncement(`[📣] "${player.name}" reinicou a partida!`, null, welcomeColor, "bold", Notification.CHAT)
    }
}

function adminCommand(player, message) {
    let msgArray = message.split(/ +/).slice(1)
    if ((msgArray.length === 1 && msgArray[0] === adminPassword)){
        room.setPlayerAdmin(player.id, true)
        authWhiteList.push(playerAuth[player.id])
        room.sendAnnouncement(`[📣] ${player.name} agora é admin da sala!`, null, welcomeColor, "bold", Notification.CHAT)
        return
    }
    if (msgArray.length >= 1 && player.admin){
        let targetName = msgArray[0].toLowerCase()
        let players = room.getPlayerList()
        let matches = players.filter(p => p.name.toLowerCase().includes(targetName))

        if (matches.length === 1){
            let target = matches[0]
            room.setPlayerAdmin(target.id, true)
            authWhiteList.push(playerAuth[target.id])
            room.sendAnnouncement(`[📣] "${target.name}" agora é admin da sala! Concebido por "${player.name}".`, null, welcomeColor, "bold", Notification.CHAT)
        } else if (matches.length > 1){
            room.sendAnnouncement(`[❌] Mais de um jogador corresponde ao nick: "${msgArray[0]}". Seja mais específico!`, player.id, welcomeColor, "bold", Notification.CHAT)
        } else {
            room.sendAnnouncement(`[❌] Nenhum jogador corresponde ao nick: "${msgArray[0]}".`, player.id, welcomeColor, "bold", Notification.CHAT)
        }
    } else if (!player.admin && msgArray.length >= 1 && msgArray[0] !== adminPassword) {
        room.sendAnnouncement(`[❌] Comando inválido ou você não tem permissão.`, player.id, welcomeColor, "bold", Notification.CHAT)
    }
}

function unadminCommand(player, message) {
    let msgArray = message.split(/ +/).slice(1)
    if (msgArray.length >= 1 && player.admin){
        let players = room.getPlayerList()
        let targetName = msgArray[0].toLowerCase()
        let matches = players.filter(p => p.name.toLowerCase().includes(targetName))

        if (matches.length === 1){
            let target = matches[0]
            room.setPlayerAdmin(target.id, false)
            authWhiteList.push(playerAuth[target.id])
            room.sendAnnouncement(`[📣] "${target.name}" deixou de ser admin da sala! Retirado por ${player.name}.`, null, welcomeColor, "bold", Notification.CHAT)
        } else if (matches.length > 1){
            room.sendAnnouncement(`[❌] Mais de um jogador corresponde ao nick "${msgArray[0]}". Seja mais específico!`, player.id, welcomeColor, "bold", Notification.CHAT)
        } else {
            room.sendAnnouncement(`[❌] Nenhum jogador corresponde ao nick "${msgArray[0]}".`, player.id, welcomeColor, "bold", Notification.CHAT)
        }
    } else if (!player.admin && msgArray.length >= 1 && msgArray[0] !== adminPassword) {
        room.sendAnnouncement(`[❌] Comando inválido ou você não tem permissão.`, player.id, welcomeColor, "bold", Notification.CHAT)
    }
}

function leaveCommand(player, message){
    room.kickPlayer(player.id, "Tchau!", false)
    room.sendAnnouncement(`[📣] O jogador "${player.name}" saiu da sala!`, null, welcomeColor, "bold", Notification.CHAT)
}

function roomCommand(player, message){
    let msgArray = message.split(/ +/).slice(1)
    if (!player.admin) {
        room.sendAnnouncement(`Apenas administradores podem usar esse comando`, player.id, announcementColor, "bold", Notification.CHAT)
        return;
    }
    if (msgArray.length < 1 ){
        room.sendAnnouncement(`Uso correto: !sala nome`, player.id, announcementColor, "bold", Notification.CHAT)
        return
    }

    let nome = msgArray[0].toLowerCase()

    if (mapas[nome]){
        room.setCustomStadium(mapas[nome])
        room.sendAnnouncement(`O mapa foi trocado para ${mapas[nome].name} por ${player.id}`, null, announcementColor, "bold", Notification.CHAT)
    } else {
        room.sendAnnouncement(`Mapa ${nome} não encontrada.`, player.id, announcementColor, "bold", Notification.CHAT)
    }
}

function teamCommand(player, message){
    if (!player.admin){
        room.sendAnnouncement(`Você precisa ser administrador para usar esse comando!`, player.id, announcementColor, "bold", Notification.CHAT)
        return
    }

    let args = message.split(/ +/).slice(1)

    if (args.length < 2){
        room.sendAnnouncement(`[PV] Uso incorreto! Utilize dessa forma: !time <red(1)/blue(2)> jogador1, jogador2, jogador3.`, player.id, announcementColor, "bold", Notification.CHAT)
    }

    let teams = parseInt(args[0])

    if(![0, 1, 2].includes(teams)) {
        room.sendAnnouncement(`[PV] Número de time inválido. Use 0(espectador), 1 (mandante) ou 2 (visitante).`, player.id, announcementColor, "bold", Notification.CHAT)
    }

    const RawList = message.split(/ +/).slice(2).join(" ");
	const nameList = RawList.split(",").map(name => name.trim().toLowerCase());
	const players = room.getPlayerList();

	const matched = [];
	const notFound = [];
	const duplicates = [];

	for (const name of nameList) {
		if (matched.some(p => p.name.toLowerCase().includes(name))) {
			duplicates.push(name);
			continue;
		}

		const playerMatch = players.find(p => p.name.toLowerCase().includes(name));

		if (playerMatch) {
			matched.push(playerMatch);
		} else {
			notFound.push(name);
		}
	}

	for (const p of matched) {
		room.setPlayerTeam(p.id, team);
	}

    if (matched.length > 0) {
		const list = matched.map(p => p.name).join(", ");
		room.sendAnnouncement(`${matched.length} jogador(es) movido(s) para o time ${team}: ${list}`, null, announcementColor, "bold", Notification.CHAT);
	}

	if (notFound.length > 0) {
		room.sendAnnouncement(`[PV] Não encontrado(s): ${notFound.join(", ")}`, player.id, announcementColor, "bold", Notification.CHAT);
	}

	if (duplicates.length > 0) {
		room.sendAnnouncement(`[PV] Ignorado(s) por duplicação: ${duplicates.join(", ")}`, player.id, announcementColor, "bold", Notification.CHAT);
	}
}
