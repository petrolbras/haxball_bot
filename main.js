/* Configurações primordiais da SALA */

let room = HBInit ({
    roomName: "Teste",
    maxPlayers: 16,
    playerName: "Bot",
    noPlayer: false,
    public: false
});

/* variáveis Globais */

const role = { PLAYER: 0, ADMIN: 1};
const uniform = { COUNTRY: 0, CLUBLA: 1, CLUBEU: 2 };
const speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
const announcementColor = 0xfffafa;
const {adminPassword} = require('./config')
let point = [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
];
let ballSpeed;
let lastPlayerKick = { id: 0, team: 0 };
let penultPlayerKick;
let undefeatedScore = 0;
let players;
let numberEachTeam;
let playerAuth = [];
let authWhiteList = [];

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
    ajuda: {
        similar: ['help'],
        roles: role.PLAYER,
        desc: `Este comando mostra todos os outros comandos disponíveis`,
        function: helpCommand
    },
    quit: {
        similar: ['quitar', 'leave', 'sair', 'qt'],
        roles: role.PLAYER,
        desc: `Este comando te desconecta da sala.`,
        function: leaveCommmand
    },
    uniforme: {
        similar: ['uni', 'uniformes', 'uniform'],
        roles: role.PLAYER,
        desc: `Este comando mostra todos os uniformes disponíveis para seu time vestir.`,
        function: uniformCommand
    },
    reserva: {
        similar: ['sub'],
        roles: role.PLAYER,
        desc: `Este comando muda o uniforme de seu time para o uniforme reserva disponível.`,
        function: reserveCommand
    },
    time: {
        similar: ['team', 'tm'],
        roles: role.ADMIN,
        desc: `Este comando define os times da sala.`,
        function: teamCommand
    },
    restart: {
        similar: ['rr', 'res'],
        roles: role.ADMIN,
        desc: `Este comando reinicia a partida.`,
        function: restartCommand
    },
    admin: {
        similar: ['adm'],
        roles: role.ADMIN,
        desc: `Este comando concede ADMIN para outro player`,
        function: adminCommand
    },
    sala : {
        similar: ['room', 'mapa'],
        roles: role.ADMIN,
        desc: `Este comando altera o mapa`,
        function: roomCommand
    }
};

/* Lista de uniformes */

let uniformes = {
    /* Times brasileiros */

    cor: {
        name: 'Corinthians',
        type: Uniform.CLUBSA,
        emoji: '⚪⚫⚪',
        angle: 0,
        textcolor: 0x000000,
        color1: 0xffffff,
        color2: 0xffffff,
        color3: 0x000000,
        angle2: 0,
        textcolor2: 0xffffff,
        color21: 0x000000,
        color22: 0x000000,
        color23: 0xffffff
    },
    san: {
        name: 'Santos',
        type: Uniform.CLUBSA,
        emoji: '⚪⚪⚪',
        angle: 0,
        textcolor: 0x000000,
        color1: 0xffffff,
        color2: 0xffffff,
        color3: 0xffffff,
        angle2: 90,
        textcolor2: 0xffffff,
        color21: 0xffffff,
        color22: 0x39c3da,
        color23: 0xffffff
    },
    mir: {
        name: 'Mirassol',
        type: Uniform.CLUBSA,
        emoji: '🟡🟢🟡',
        angle: 40,
        textcolor: 0xffffff,
        color1: 0xdbc500,
        color2: 0x015141,
        color3: 0xdbc500,
        angle2: 40,
        textcolor2: 0x000000,
        color21: 0xffffff,
        color22: 0xdbc500,
        color23: 0xffffff
    },
    pal: {
        name: 'Palmeiras',
        type: Uniform.CLUBSA,
        emoji: '🟢⚪🟢',
        angle: 90,
        textcolor: 0xffffff,
        color1: 0x118516,
        color2: 0x118516,
        color3: 0xffffff,
        angle2: 90,
        textcolor2: 0x118516,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    sp: {
        name: 'São Paulo',
        type: Uniform.CLUBSA,
        emoji: '⚪🔴⚫',
        angle: 0,
        textcolor: 0xffffff,
        color1: 0xea272d,
        color2: 0x000000,
        color3: 0xea272d,
        angle2: 0,
        textcolor2: 0xd61a19,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    fla: {
        name: 'Flamengo',
        type: Uniform.CLUBSA,
        emoji: '🔴⚫🔴',
        angle: 90,
        textcolor: 0xffffff,
        color1: 0xc90202,
        color2: 0x1f1f1f,
        color3: 0xc90202,
        angle2: 90,
        textcolor2: 0x000000,
        color21: 0xffffff,
        color22: 0xc90202,
        color23: 0xffffff
    },
    vas: {
        name: 'Vasco',
        type: Uniform.CLUBSA,
        emoji: '⚫⚪⚫',
        angle: 135,
        textcolor: 0xff0000,
        color1: 0x000000,
        color2: 0xffffff,
        color3: 0x030303,
        angle2: 135,
        textcolor2: 0xff0000,
        color21: 0xffffff,
        color22: 0x000000,
        color23: 0xffffff
    },
    bot: {
        name: 'Botafogo',
        type: Uniform.CLUBSA,
        emoji: '⚪⚫⚪',
        angle: 0,
        textcolor: 0xffffff,
        color1: 0x000000,
        color2: 0x000000,
        color3: 0xffffff,
        angle2: 0,
        textcolor2: 0x000000,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    flu: {
        name: 'Fluminense',
        type: Uniform.CLUBSA,
        emoji: '🟢🔴⚪',
        angle: 40,
        textcolor: 0x000000,
        color1: 0xa32222,
        color2: 0xffffff,
        color3: 0x28585c,
        angle2: 40,
        textcolor2: 0xa32222,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    cru: {
        name: 'Cruzeiro',
        type: Uniform.CLUBSA,
        emoji: '🔵⚪🔵',
        angle: 0,
        textcolor: 0xffffff,
        color1: 0x0f5ba5,
        color2: 0x0f5ba5,
        color3: 0xffffff,
        angle2: 0,
        textcolor2: 0x0f5ba5,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    galo: {
        name: 'Atletico Mineiro',
        type: Uniform.CLUBSA,
        emoji: '⚫⚪⚫',
        angle: 0,
        textcolor: 0xb59f38,
        color1: 0x050505,
        color2: 0xffffff,
        color3: 0x000000,
        angle2: 0,
        textcolor2: 0xb59f38,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    inter: {
        name: 'Internacional',
        type: Uniform.CLUBSA,
        emoji: '🔴⚪🔴',
        angle: 90,
        textcolor: 0xffffff,
        color1: 0xff0303,
        color2: 0xff0303,
        color3: 0xff0303,
        angle2: 90,
        textcolor2: 0xff0303,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    grem: {
        name: 'Grêmio',
        type: Uniform.CLUBSA,
        emoji: '🔵⚪🔵',
        angle: 0,
        textcolor: 0xffffff,
        color1: 0x1499ff,
        color2: 0x141716,
        color3: 0x1499ff,
        angle2: 0,
        textcolor2: 0xffffff,
        color21: 0x66c2ff,
        color22: 0x66c2ff,
        color23: 0x66c2ff
    },
    bah: {
        name: 'Bahia',
        type: Uniform.CLUBSA,
        emoji: '🔵⚪🔴',
        angle: 0,
        textcolor: 0x000000,
        color1: 0x12b0ff,
        color2: 0xffffff,
        color3: 0xff1c33,
        angle2: 120,
        textcolor2: 0xe8e238,
        color21: 0x4336ff,
        color22: 0xf5fdff,
        color23: 0xff2121
    },
    vit: {
        name: 'Vitória',
        type: Uniform.CLUBSA,
        emoji: '⚫🔴⚫',
        angle: 90,
        textcolor: 0xffffff,
        color1: 0xff1d0d,
        color2: 0x000000,
        color3: 0x000000,
        angle2: 0,
        textcolor2: 0xff1d0d,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    riv: {
        name: 'River Plate',
        type: Uniform.CLUBSA,
        emoji: '⚪🔴⚪',
        angle: 40,
        textcolor: 0x000000,
        color1: 0xffffff,
        color2: 0xff1d0d,
        color3: 0xffffff,
        angle2: 0,
        textcolor2: 0xffffff,
        color21: 0xff1d0d,
        color22: 0x000000,
        color23: 0xff1d0d
    },
    boca: {
        name: 'Boca Juniors',
        type: Uniform.CLUBSA,
        emoji: '🔵🟡🔵',
        angle: 90,
        textcolor: 0xffffff,
        color1: 0x0c04e0,
        color2: 0xe8e800,
        color3: 0x0c04e0,
        angle2: 0,
        textcolor2: 0x3d3e52,
        color21: 0xdeba64,
        color22: 0xdeba64,
        color23: 0xdeba64
    },

    /* Times gringos */

    psg: {
        name: 'Paris Saint-Germain',
        type: Uniform.CLUBEU,
        emoji: '🔵⚪🔴',
        angle: 180,
        textcolor: 0xffffff,
        color1: 0x000080,
        color2: 0xb22222,
        color3: 0x000080,
        angle2: 180,
        textcolor2: 0x000080,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    bay: {
        name: 'Bayern',
        type: Uniform.CLUBEU,
        emoji: '🔴⚪🔴',
        angle: 30,
        textcolor: 0xffffff,
        color1: 0xff0000,
        color2: 0xff0000,
        color3: 0xff0000,
        angle2: 30,
        textcolor2: 0xff0000,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    bor: {
        name: 'Borussia',
        type: Uniform.CLUBEU,
        emoji: '⚫🟡⚫',
        angle: 90,
        textcolor: 0x000000,
        color1: 0xeeee00,
        color2: 0xeeee00,
        color3: 0xeeee00,
        angle2: 90,
        textcolor2: 0xbecc00,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    chel: {
        name: 'Chelsea',
        type: Uniform.CLUBEU,
        emoji: '🔵⚪🔵',
        angle: 90,
        textcolor: 0xffffff,
        color1: 0x0000cd,
        color2: 0x0000cd,
        color3: 0x0000cd,
        angle2: 90,
        textcolor2: 0x0000cd,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    liv: {
        name: 'Liverpool',
        type: Uniform.CLUBEU,
        emoji: '🔴🔴🔴',
        angle: 40,
        textcolor: 0xffffff,
        color1: 0xdf1c3c,
        color2: 0xdf1c3c,
        color3: 0xdf1c3c,
        angle2: 40,
        textcolor2: 0xdf1c3c,
        color21: 0xffffff,
        color22: 0xffffff,
        color23: 0xffffff
    },
    ars: {
        name: 'Arsenal',
        type: Uniform.CLUBEU,
        emoji: '⚪🔴⚪',
        angle: 90,
        textcolor: 0xffffff,
        color1: 0xff0000,
        color2: 0xff0000,
        color3: 0xff0000,
        angle2: 40,
        textcolor2: 0xd8062d,
        color21: 0x151c36,
        color22: 0x32439d,
        color23: 0x151c36
    },
    juve: {
        name: 'Juventus',
        type: Uniform.CLUBEU,
        emoji: '⚪⚫⚪',
        angle: 40,
        textcolor: 0xbfac00,
        color1: 0x000000,
        color2: 0xffffff,
        color3: 0x000000,
        angle2: 40,
        textcolor2: 0xbfac00,
        color21: 0xb7e8f7,
        color22: 0xffffff,
        color23: 0xb7e8f7
    },
    itm: {
        name: 'Internazionale',
        type: Uniform.CLUBEU,
        emoji: '🔵⚪🔵',
        angle: 0,
        textcolor: 0xffffff,
        color1: 0x001e94,
        color2: 0x000000,
        color3: 0x001e94,
        angle2: 40,
        textcolor2: 0x001e94,
        color21: 0x92dfe5,
        color22: 0xffffff,
        color23: 0x36a7e9
    },
    nap: {
        name: 'Napoli',
        type: Uniform.CLUBEU,
        emoji: '🔵⚪🔵',
        angle: 0,
        textcolor: 0xffffff,
        color1: 0x0099ff,
        color2: 0x0099ff,
        color3: 0x0099ff,
        angle2: 0,
        textcolor2: 0xffffff,
        color21: 0x1f1e22,
        color22: 0x1f1e22,
        color23: 0x1f1e22
    },
    acm: {
        name: 'Milan',
        type: Uniform.CLUBEU,
        emoji: '🔴⚪🔴',
        angle: 0,
        textcolor: 0xffffff,
        color1: 0xe80000,
        color2: 0x000000,
        color3: 0xe80000,
        angle2: 40,
        textcolor2: 0xe80000,
        color21: 0x000000,
        color22: 0x000000,
        color23: 0x000000
    },
    rma: {
        name: 'Real Madrid',
        type: Uniform.CLUBEU,
        emoji: '⚪🟡⚪',
        angle: 132,
        textcolor: 0xffcd45,
        color1: 0xffffff,
        color2: 0x004077,
        color3: 0xffffff,
        angle2: 132,
        textcolor2: 0xffffff,
        color21: 0x004077,
        color22: 0x004077,
        color23: 0x004077
    },
    fcb: {
        name: 'Barcelona',
        type: Uniform.CLUBEU,
        emoji: '🔴🟡🔵',
        angle: 0,
        textcolor: 0xdeb405,
        color1: 0xa2214b,
        color2: 0x00529f,
        color3: 0x00529f,
        angle2: 40,
        textcolor2: 0x0e3e90,
        color21: 0x1e1e1e,
        color22: 0x1e1e1e,
        color23: 0x1e1e1e
    },
    val: {
        name: 'Valencia',
        type: Uniform.CLUBEU,
        emoji: '🟡🔴🟡',
        angle: 0,
        textcolor: 0x000000,
        color1: 0xffffff,
        color2: 0xffffff,
        color3: 0xffffff,
        angle2: 0,
        textcolor2: 0xf87667,
        color21: 0xa3172d,
        color22: 0xa3172d,
        color23: 0xa3172d
    },
    rb: {
        name: 'Real Betis',
        type: Uniform.CLUBEU,
        emoji: '🟢⚪🟢',
        angle: 0,
        textcolor: 0x000000,
        color1: 0x00de3b,
        color2: 0xfffafa,
        color3: 0x00de3b,
        angle2: 0,
        textcolor2: 0xffffff,
        color21: 0x017ca5,
        color22: 0x017ca5,
        color23: 0x017ca5
    },

    /* Times custom */

    reggae: {
        name: 'Reggae',
        type: Uniform.CLUBCS,
        emoji: '🔴🟡🟢',
        angle: 90,
        textcolor: 0x000000,
        color1: 0xff0000,
        color2: 0xffff00,
        color3: 0x006400,
        angle2: 90,
        textcolor2: 0x000000,
        color21: 0xff0000,
        color22: 0xffff00,
        color23: 0x006400
    },
    cdl: {
        name: 'Catadores de Latinha',
        type: Uniform.CLUBCS,
        emoji: '🟠⚫🟠',
        angle: 40,
        textcolor: 0xffffff,
        color1: 0xfd4700,
        color2: 0x282828,
        color3: 0xfd4700,
        angle2: 40,
        textcolor2: 0xffffff,
        color21: 0x282828,
        color22: 0xfd4700,
        color23: 0x282828
    }
};

/* Estádios */

var stadiumx3 = `{

"name" : "Futsal x3 FAZo7",

"width" : 620,

"height" : 270,

"spawnDistance" : 350,

"bg" : { "type" : "hockey", "width" : 550, "height" : 240, "kickOffRadius" : 80, "cornerRadius" : 0 },

"vertexes" : [
    /* 0 */ { "x" : 550, "y" : 240, "trait" : "ballArea" },
    /* 1 */ { "x" : 550, "y" : -240, "trait" : "ballArea" },
    
    /* 2 */ { "x" : 0, "y" : 270, "trait" : "kickOffBarrier" },
    /* 3 */ { "x" : 0, "y" : 80, "bCoef" : 0.15, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 180 },
    /* 4 */ { "x" : 0, "y" : -80, "bCoef" : 0.15, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 180 },
    /* 5 */ { "x" : 0, "y" : -270, "trait" : "kickOffBarrier" },
    
    /* 6 */ { "x" : -550, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
    /* 7 */ { "x" : -590, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
    /* 8 */ { "x" : -590, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
    /* 9 */ { "x" : -550, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
    /* 10 */ { "x" : 550, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,-80 ] },
    /* 11 */ { "x" : 590, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,-80 ] },
    /* 12 */ { "x" : 590, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,80 ] },
    /* 13 */ { "x" : 550, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,80 ] },
    
    /* 14 */ { "x" : -550, "y" : 80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8", "pos" : [-700,80 ] },
    /* 15 */ { "x" : -550, "y" : 240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8" },
    /* 16 */ { "x" : -550, "y" : -80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8", "pos" : [-700,-80 ] },
    /* 17 */ { "x" : -550, "y" : -240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8" },
    /* 18 */ { "x" : -550, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
    /* 19 */ { "x" : 550, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
    /* 20 */ { "x" : 550, "y" : 80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "pos" : [700,80 ] },
    /* 21 */ { "x" : 550, "y" : 240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea" },
    /* 22 */ { "x" : 550, "y" : -240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8" },
    /* 23 */ { "x" : 550, "y" : -80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8", "pos" : [700,-80 ] },
    /* 24 */ { "x" : 550, "y" : -240, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
    /* 25 */ { "x" : 550, "y" : -240, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
    /* 26 */ { "x" : -550, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0 },
    /* 27 */ { "x" : 550, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0 },
    
    /* 28 */ { "x" : 0, "y" : -240, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
    /* 29 */ { "x" : 0, "y" : -80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
    /* 30 */ { "x" : 0, "y" : 80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
    /* 31 */ { "x" : 0, "y" : 240, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
    /* 32 */ { "x" : 0, "y" : -80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "trait" : "kickOffBarrier", "vis" : true, "color" : "F8F8F8" },
    /* 33 */ { "x" : 0, "y" : 80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "trait" : "kickOffBarrier", "vis" : true, "color" : "F8F8F8" },
    /* 34 */ { "x" : 0, "y" : 80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : -180 },
    /* 35 */ { "x" : 0, "y" : -80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : -180 },
    /* 36 */ { "x" : 0, "y" : 80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 0 },
    /* 37 */ { "x" : 0, "y" : -80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 0 },
    
    /* 38 */ { "x" : -557.5, "y" : 80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false, "pos" : [-700,80 ] },
    /* 39 */ { "x" : -557.5, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false },
    /* 40 */ { "x" : -557.5, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0 },
    /* 41 */ { "x" : -557.5, "y" : -80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0, "pos" : [-700,-80 ] },
    /* 42 */ { "x" : 557.5, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0 },
    /* 43 */ { "x" : 557.5, "y" : -80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0, "pos" : [700,-80 ] },
    /* 44 */ { "x" : 557.5, "y" : 80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false, "pos" : [700,80 ] },
    /* 45 */ { "x" : 557.5, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false },
    
    /* 46 */ { "x" : 0, "y" : -80, "bCoef" : 0.1, "trait" : "line" },
    /* 47 */ { "x" : 0, "y" : 80, "bCoef" : 0.1, "trait" : "line" },
    /* 48 */ { "x" : -550, "y" : -80, "bCoef" : 0.1, "trait" : "line" },
    /* 49 */ { "x" : -550, "y" : 80, "bCoef" : 0.1, "trait" : "line" },
    /* 50 */ { "x" : 550, "y" : -80, "bCoef" : 0.1, "trait" : "line" },
    /* 51 */ { "x" : 550, "y" : 80, "bCoef" : 0.1, "trait" : "line" },
    /* 52 */ { "x" : -550, "y" : 200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
    /* 53 */ { "x" : -390, "y" : 70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
    /* 54 */ { "x" : -550, "y" : 226, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
    /* 55 */ { "x" : -536, "y" : 240, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
    /* 56 */ { "x" : -550, "y" : -200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
    /* 57 */ { "x" : -390, "y" : -70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
    /* 58 */ { "x" : -550, "y" : -226, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
    /* 59 */ { "x" : -536, "y" : -240, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
    /* 60 */ { "x" : -381, "y" : -240, "bCoef" : 0.1, "trait" : "line" },
    /* 61 */ { "x" : 550, "y" : -226, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
    /* 62 */ { "x" : 536, "y" : -240, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
    /* 63 */ { "x" : 550, "y" : 226, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
    /* 64 */ { "x" : 536, "y" : 240, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
    /* 65 */ { "x" : 550, "y" : 200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
    /* 66 */ { "x" : 390, "y" : 70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
    /* 67 */ { "x" : 550, "y" : -200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
    /* 68 */ { "x" : 390, "y" : -70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
    /* 69 */ { "x" : 390, "y" : 70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
    /* 70 */ { "x" : 390, "y" : -70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
    /* 71 */ { "x" : -375, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 72 */ { "x" : -375, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 73 */ { "x" : -375, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 74 */ { "x" : -375, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 75 */ { "x" : -375, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 76 */ { "x" : -375, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 77 */ { "x" : -375, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 78 */ { "x" : -375, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 79 */ { "x" : 375, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 80 */ { "x" : 375, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 81 */ { "x" : 375, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 82 */ { "x" : 375, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 83 */ { "x" : 375, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 84 */ { "x" : 375, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 85 */ { "x" : 375, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 86 */ { "x" : 375, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 87 */ { "x" : -277.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 88 */ { "x" : -277.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 89 */ { "x" : -277.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 90 */ { "x" : -277.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 91 */ { "x" : -277.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 92 */ { "x" : -277.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 93 */ { "x" : -277.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 94 */ { "x" : -277.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 95 */ { "x" : 277.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 96 */ { "x" : 277.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 97 */ { "x" : 277.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 98 */ { "x" : 277.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 99 */ { "x" : 277.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 100 */ { "x" : 277.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 101 */ { "x" : 277.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 102 */ { "x" : 277.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
    /* 103 */ { "x" : -240, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
    /* 104 */ { "x" : -240, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
    /* 105 */ { "x" : -120, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
    /* 106 */ { "x" : -120, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
    /* 107 */ { "x" : 240, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
    /* 108 */ { "x" : 240, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
    /* 109 */ { "x" : 120, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
    /* 110 */ { "x" : 120, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
    /* 111 */ { "x" : -381, "y" : 240, "bCoef" : 0.1, "trait" : "line" },
    /* 112 */ { "x" : -381, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
    /* 113 */ { "x" : -556, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
    /* 114 */ { "x" : -575, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
    /* 115 */ { "x" : 556, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
    /* 116 */ { "x" : 575, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
    /* 117 */ { "x" : -556, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
    /* 118 */ { "x" : -575, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
    /* 119 */ { "x" : 556, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
    /* 120 */ { "x" : 575, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
    /* 121 */ { "x" : -381, "y" : -240, "bCoef" : 0.1, "trait" : "line" },
    /* 122 */ { "x" : -381, "y" : -256, "bCoef" : 0.1, "trait" : "line" },
    /* 123 */ { "x" : 381, "y" : 240, "bCoef" : 0.1, "trait" : "line" },
    /* 124 */ { "x" : 381, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
    /* 125 */ { "x" : 381, "y" : -240, "bCoef" : 0.1, "trait" : "line" },
    /* 126 */ { "x" : 381, "y" : -256, "bCoef" : 0.1, "trait" : "line" }

],

"segments" : [
    { "v0" : 6, "v1" : 7, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,-80 ], "y" : -80 },
    { "v0" : 7, "v1" : 8, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : -590 },
    { "v0" : 8, "v1" : 9, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,80 ], "y" : 80 },
    { "v0" : 10, "v1" : 11, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [700,-80 ], "y" : -80 },
    { "v0" : 11, "v1" : 12, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : 590 },
    { "v0" : 12, "v1" : 13, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [700,80 ], "y" : 80 },
    
    { "v0" : 2, "v1" : 3, "trait" : "kickOffBarrier" },
    { "v0" : 3, "v1" : 4, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.15, "cGroup" : ["blueKO" ], "trait" : "kickOffBarrier" },
    { "v0" : 3, "v1" : 4, "curve" : -180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.15, "cGroup" : ["redKO" ], "trait" : "kickOffBarrier" },
    { "v0" : 4, "v1" : 5, "trait" : "kickOffBarrier" },
    
    { "v0" : 14, "v1" : 15, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -550 },
    { "v0" : 16, "v1" : 17, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -550 },
    { "v0" : 18, "v1" : 19, "vis" : true, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "y" : 240 },
    { "v0" : 20, "v1" : 21, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 550 },
    { "v0" : 22, "v1" : 23, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 550 },
    { "v0" : 24, "v1" : 25, "vis" : true, "color" : "F8F8F8", "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 550, "y" : -240 },
    { "v0" : 26, "v1" : 27, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "y" : -240 },
    
    { "v0" : 28, "v1" : 29, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
    { "v0" : 30, "v1" : 31, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
    
    { "v0" : 38, "v1" : 39, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -557.5 },
    { "v0" : 40, "v1" : 41, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -557.5 },
    { "v0" : 42, "v1" : 43, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 557.5 },
    { "v0" : 44, "v1" : 45, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 557.5 },
    
    { "v0" : 46, "v1" : 47, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 0 },
    { "v0" : 48, "v1" : 49, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -550 },
    { "v0" : 50, "v1" : 51, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 550 },
    { "v0" : 52, "v1" : 53, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 55, "v1" : 54, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 56, "v1" : 57, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 53, "v1" : 57, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 59, "v1" : 58, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 62, "v1" : 61, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 64, "v1" : 63, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 65, "v1" : 66, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 67, "v1" : 68, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
    { "v0" : 69, "v1" : 70, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 390 },
    { "v0" : 72, "v1" : 71, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 71, "v1" : 72, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 74, "v1" : 73, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 73, "v1" : 74, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 76, "v1" : 75, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 75, "v1" : 76, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 78, "v1" : 77, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 77, "v1" : 78, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
    { "v0" : 80, "v1" : 79, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 79, "v1" : 80, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 82, "v1" : 81, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 81, "v1" : 82, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 84, "v1" : 83, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 83, "v1" : 84, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 86, "v1" : 85, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 85, "v1" : 86, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
    { "v0" : 88, "v1" : 87, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 87, "v1" : 88, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 90, "v1" : 89, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 89, "v1" : 90, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 92, "v1" : 91, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 91, "v1" : 92, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 94, "v1" : 93, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 93, "v1" : 94, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
    { "v0" : 96, "v1" : 95, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 95, "v1" : 96, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 98, "v1" : 97, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 97, "v1" : 98, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 100, "v1" : 99, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 99, "v1" : 100, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 102, "v1" : 101, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 101, "v1" : 102, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
    { "v0" : 103, "v1" : 104, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240 },
    { "v0" : 105, "v1" : 106, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -120 },
    { "v0" : 107, "v1" : 108, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 240 },
    { "v0" : 109, "v1" : 110, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 120 },
    { "v0" : 111, "v1" : 112, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -381 },
    { "v0" : 113, "v1" : 114, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : 123 },
    { "v0" : 115, "v1" : 116, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : 123 },
    { "v0" : 117, "v1" : 118, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : -123 },
    { "v0" : 119, "v1" : 120, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : -123 },
    { "v0" : 121, "v1" : 122, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -381 },
    { "v0" : 123, "v1" : 124, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 381 },
    { "v0" : 125, "v1" : 126, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 381 }

],

"goals" : [
    { "p0" : [-556.25,-80 ], "p1" : [-556.25,80 ], "team" : "red" },
    { "p0" : [556.25,80 ], "p1" : [556.25,-80 ], "team" : "blue" }

],

"discs" : [
    { "radius" : 5, "pos" : [-550,80 ], "color" : "6666CC", "trait" : "goalPost", "y" : 80 },
    { "radius" : 5, "pos" : [-550,-80 ], "color" : "6666CC", "trait" : "goalPost", "y" : -80, "x" : -560 },
    { "radius" : 5, "pos" : [550,80 ], "color" : "6666CC", "trait" : "goalPost", "y" : 80 },
    { "radius" : 5, "pos" : [550,-80 ], "color" : "6666CC", "trait" : "goalPost", "y" : -80 },
    
    { "radius" : 3, "invMass" : 0, "pos" : [-550,240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
    { "radius" : 3, "invMass" : 0, "pos" : [-550,-240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
    { "radius" : 3, "invMass" : 0, "pos" : [550,-240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
    { "radius" : 3, "invMass" : 0, "pos" : [550,240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" }

],

"planes" : [
    { "normal" : [0,1 ], "dist" : -240, "bCoef" : 1, "trait" : "ballArea", "vis" : false, "curve" : 0 },
    { "normal" : [0,-1 ], "dist" : -240, "bCoef" : 1, "trait" : "ballArea" },
    
    { "normal" : [0,1 ], "dist" : -270, "bCoef" : 0.1 },
    { "normal" : [0,-1 ], "dist" : -270, "bCoef" : 0.1 },
    { "normal" : [1,0 ], "dist" : -620, "bCoef" : 0.1 },
    { "normal" : [-1,0 ], "dist" : -620, "bCoef" : 0.1 },
    
    { "normal" : [1,0 ], "dist" : -620, "bCoef" : 0.1, "trait" : "ballArea", "vis" : false, "curve" : 0 },
    { "normal" : [-1,0 ], "dist" : -620, "bCoef" : 0.1, "trait" : "ballArea", "vis" : false, "curve" : 0 }

],

"traits" : {
    "ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball" ] },
    "goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 0.5 },
    "goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball" ] },
    "line" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["" ] },
    "kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ] }

},

"playerPhysics" : {
    "bCoef" : 0,
    "acceleration" : 0.11,
    "kickingAcceleration" : 0.083,
    "kickStrength" : 5

},

"ballPhysics" : {
    "radius" : 6.25,
    "bCoef" : 0.4,
    "invMass" : 1.5,
    "damping" : 0.99,
    "color" : "FFCC00"

}
}`

/* Configurações principais da SALA */

room.setCustomStadium(goaltogoal)
room.setScoreLimit(0);
room.setTimeLimit(3);
room.setTeamsLock(true);
room.setTeamColors(1, uniforms[acronymHome].angle, uniforms[acronymHome].textcolor, [uniforms[acronymHome].color1, uniforms[acronymHome].color2, uniforms[acronymHome].color3]);
room.setTeamColors(2, uniforms[acronymGuest].angle, uniforms[acronymGuest].textcolor, [uniforms[acronymGuest].color1, uniforms[acronymGuest].color2, uniforms[acronymGuest].color3]);

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
}

room.onPlayerjoin = function(player) {
    room.sendAnnouncement(centerText(`[PV] Bem-Vindo ${player.name}! digite "!ajuda" para ver os comandos do server.`), played.id, announcementColor, "bold", Notification.CHAT);
    updateAdmins();
    let players = room.getPlayerList()
    if(players.length < 7){
        numberEachTeam = parseInt(players.length / 2)
    } else {
        numberEachTeam = 3;
    }
}

room.onPlayerLeave = function(player) {
    updateAdmins()
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
        if (command !== false) {
            commands[command].function(player, message)
            return false
        }
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
			for (var i = 0; i < playersTeamHome.length; i++) {
				room.setPlayerTeam(playersTeamHome[i].id, 0);
			}
		}, 6000);

		setTimeout(function () {
			for (var i = 0; i < playersTeamGuest.length; i++) {
				room.setPlayerTeam(playersTeamGuest[i].id, 1);
			}
		}, 7000);

		setTimeout(function () {
			for (var i = 0; i < numberEachTeam; i++) {
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

/* Funções auxiliares */

function updateAdmins() {
    let players = room.getPlayerList();
    if (players.length == 0) return;
    if (players.find((player) => player.admin) != null) return;
    room.setPlayerAdmin(players[0].id, true);
}


/* Funções dos comandos */

function helpCommand(player, message) {
    msgArray = message.split(/ +/).splice(1)
    if (msgArray.length === 0){
        let commandString = "[PV] LISTA DE COMANDOS DO SERVER"
        commandString += "\nComandos de Players:"
        for (const [key, value] of Object.entries(commands)){
            if(value.desc && value.roles === role.PLAYER) {
                commandString += `!${key},`
            }
        }
        commandString = commandString.substring(0, commandString.length - 1) + "."
        if (player.admin){
            commandString += "\nComandos de Adminstradores: "
            for(const [key, value] of Object.entries(commands)){
                if(value.desc && value.roles === role.ADMIN){
                    commandString += `!${key}`
                }
            }
        }
        if (commandString.slice(commandString.length - 1) === ":") commandString += ` None,`;
		commandString = commandString.substring(0, commandString.length - 1) + ".";
        commandString += "\n\nPara obter informações sobre um comando em específico, digite '\'!ajuda <nome do comando>\'.";
		room.sendAnnouncement(commandString, player.id, announcementColor, "bold", Notification.CHAT);
    }
    else if (msgArray.length >= 1) {
		let commandName = getCommand(msgArray[0].toLowerCase());
		if (commandName !== false && commands[commandName].desc !== false) room.sendAnnouncement(`[PV] Comando \'${commandName}\' :\n${commands[commandName].desc}`, player.id, statsColor, "bold", Notification.CHAT);
		else room.sendAnnouncement(`[PV] Esse comando não existe. Para olhar a lista de comandos digite \'!ajuda\'`, player.id, announcementColor, "bold", Notification.CHAT);
	}
}

function uniformCommand (){
    msgArray = message.split(/ +/).splice(1)
    if (msgArray.length === 0 ){
        let uniformString = "[PV] Clubes Sulamericanos"
        for (const [key, value] of Object.entries(uniformes)){
            if (value.type === Uniform.CLUBSA) {
                uniformString += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString += `\n`
        room.sendAnnouncement(uniformString, player.id, announcementColor, "bold", Notification.CHAT)
        let uniformString2 = "[PV] Clubes Europeus"
        for (const [key, value] of Object.entries(uniformes)) {
            if (value.type === Uniform.CLUBEU) {
                uniformString2 += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString2 += `\n`
        room.sendAnnouncement(uniformString2, player.id, announcementColor, "bold", Notification.CHAT)
        let uniformString3 = "[PV] Clubes Custom"
        for (const [key, value] of Object.entries(uniformes)){
            if (value.type === Uniform.CLUBCS){
                uniformString3 += `\n ${value.name}: !uniforme ${key}`
            }
        }
        uniformString3 += `\n`
        room.sendAnnouncement(uniformString3, player.id, announcementColor, "bold", Notification.CHAT)
    }
    else if (msgArray.length >= 1){
        let uniformName = getUniform(msgArray[0].toLowerCase())
        if (uniformName !== false && uniformes[uniformName].name !== false){
            room.sendAnnouncement(`[PV] O uniforme do \'${uniformes[uniformName].name}\' foi colocado em seu time.`, played.id, announcementColor, "bold", Notification.CHAT);

            room.setTeamColors(player.team, uniformes[uniformName].angle, uniformes[uniformName].textcolor, [uniformes[uniformName].color1, uniformes[uniformName].color2, uniformes[uniformName].color3])

            if (player.team === 1){
                nameHome = uniformes[uniformName].name;
                acronymHome = uniformName;
                emojihome = uniformes[uniformName].emoji;
            } else if (player.team === 2){
                nameGuest = uniformes[uniformName].name;
                acronymGuest = uniformName;
                emojiGuest = uniformes[uniformName].emoji;
            } else {
                room.sendAnnouncement(`[PV] Esse uniforme não existe, digite \'!uniforme\' para ver todos os disponíveis`, player.id, announcementColor, "bold", Notification.CHAT);
            }
        }
    }
}

function reserveCommand(player){
    if (player.team === 1 && nameHome !== 'Mandante'){
        room.setTeamColors(player.team, uniformes[acronymHome].angle2, uniformes[acronymHome].textcolor2, [uniformes[acronymHome].color21, uniformes[acronymHome].color22, uniformes[acronymHome].color23])
    } else if (player.team === 1 && nameHome === 'Mandante'){
        room.sendAnnouncement(`[PV] Seu time ainda não tem um uniforme, digite !uniforme e veja as possibilidades.`, played.id, announcementColor, "bold", Notification.CHAT)
    }

    if (player.team === 2 && nameGuest !== 'Visitante'){
        room.setTeamColors(player.team, uniformes[acronymGuest].angle2, uniformes[acronymGuest].textcolor2, [uniformes[acronymGuest].color21, uniformes[acronymGuest].color22, uniformes[acronymGuest].color23])
    } else if (player.team === 2 && nameGuest === 'Visitante'){
        room.sendAnnouncement(`[PV] Seu time ainda não tem um uniforme, digite !uniforme e veja as possibilidades.`, player.id, announcementColor, "bold", Notification.CHAT)
    }
}

function restartCommand(player, message){
    if (player.admin) {
        instantRestart()
    }
}

function adminCommand(player, message) {
    msgArray = message.split(/ +/).slice(1)
    if ((msg.msgArray.length === 1 && msgArray[0] === adminPassword)){
        room.setPlayerAdmin(player.id, true)
        authWhiteList.lust(playerAuth[player.id])
        room.sendAnnouncement(`${player.name} agora é admin da sala!`, null, announcementColor, "bold", Notification.CHAT)
        return
    }
    if (msgArray.length >= 1 && player.admin){
        let targetName = msgArray[0].toLowerCase()
        let players = room.getPlayerList()
        let matches = players.filter(p => p.name.toLowerCase().includes(targetName))

        if (matches.length === 1){
            let target = matches[0]
            room.setPlayerAdmin(target.id, true)
            authWhiteList.lust(playerAuth[target.id])
            room.sendAnnouncement(`${target.name} agora é admin da sala" Concebido por ${player.name}.`, null, announcementColor, "bold", Notification.CHAT)
        } else if (matches.length > 1){
            room.sendAnnouncement(`Mais de um jogador corresponde a "${msgArray[0]}". Seja mais específico!`, player.id, announcementColor, "bold")
        } else {
            room.sendAnnouncement(`Nenhum jogador corresponde a "${msgArray[0]}".`, player.id, announcementColor, "bold")
        }
    } else if (!player.admin && msgArray.length >= 1 && msgArray[0] !== adminPassword) {
        room.sendAnnouncement(`Comando inválido ou você não tem permissão.`, player.id, announcementColor, "bold")
    }
}

function leaveCommmand(player, message){
    room.kickPlayer(player.id, "Tchau!", false)
}

function roomCommand(player, message){
    msgArray = message.split(/ +/).slice(1)
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
        room.sendAnnouncement(`Mapa ${nome} não encontrada.`, player.id, announcementColor, "bold". Notification.CHAT)
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
