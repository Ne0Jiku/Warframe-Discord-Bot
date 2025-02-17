require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env
const { Client, GatewayIntentBits, Partials, Events, Collection, ChannelManager, GatewayCloseCodes, GatewayDispatchEvents } = require('discord.js');
const fs = require('fs');
const { startRealTimeUpdates, sendStatusToDiscord } = require('./utils/worldstatus');
const { deploy_command } = require('./utils/deploy-commands');
const { send } = require('process');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        // ChannelManager.cache,
    ],
    partials: [
        Partials.User,
        Partials.Message,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.Channel,
    ],
});

// client.commands = new Collection();

// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     client.commands.set(command.data.name, command);
// }

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged as ${readyClient.user.tag}`);
    startRealTimeUpdates(readyClient);
    deploy_command();
})

startRealTimeUpdates();
client.login(process.env.CLIENT_TOKEN);

// sendStatusToDiscord()

module.exports = { client };
