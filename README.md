<h1 align="center"> 🏟️ Haxball Bot de Torneio 🏟️ </h1>

<p align="center"> Bot headless personalizável para organização de partidas no Haxball. Oferece comandos administrativos e funcionais para controle de mapas, times, uniformes e reservas, com foco em torneios, ligas e salas públicas. </p>

## ➤ ⚙️ Funcionalidades principais

- `!sala <nome>` – troca de mapa customizado
- `!time <número> jogador1, jogador2` – distribui jogadores em times
- `!uniforme <time>` – aplica uniformes estilizados
- `!reserva <time>` – troca o kit para reserva
- Verificação automática de permissões
- Bloqueio de troca de mapa durante partidas ativas
- Delay automático para correção de bugs do setCustomStadium
- Controle de fluxo e proteção contra comandos mal utilizados

## ➤ 📦 Requisitos

Se você está interessado em usar este bot -> 

- A sala funciona com a integração entre a API do haxball 🔗 (https://www.haxball.com/headless).

## ➤ 🔎 Como integrar o bot?

1. Abra a página da API do haxball -> 🔗 (https://www.haxball.com/headless).
2. Abra as devtools apertando F12 e selecione o console
3. Copie o código de **`main.js`** e cole no console
4. Aperte enter e complete o captcha
5. Aperte botão direito no link que surgirá e clique em "Abrir link em uma nova guia"

## ➤ Como ser administrador na sala?
> Para logar como adm, você deve usar o comando **`!admin (senha)`**

### Edite o comando de admin no código

Tanto a senha quanto os comandos de admin são editáveis, procure por "adminCommand" usando CTRL + F no código.

```js
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
```

### Edite a senha

Use CTRL + f no código e pesquise por **`adminPassword`**

```js 

let adminPassword = example

```

## ➤ 🌍 Linguas atuais

- Português do Brasil

### 📩 Feedback

- Se você achou quaisquer bugs, por favor abra uma issue nesse repositório com detalhes sobre!
