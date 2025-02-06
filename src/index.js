require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env
const { Client, GatewayIntentBits, Partials, Events, Collection } = require('discord.js');
const fs = require('fs');
const { sendStatusToDiscord } = require('./utils/worldstatus');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ],
    partials: [
        Partials.User,
        Partials.Message,
        Partials.GuildMember,
        Partials.ThreadMember
    ],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged as ${readyClient.user.tag}`);
})

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: 'Erreur de lors de l\'execution', ephemeral: true});
    }
})

sendStatusToDiscord();
client.login(process.env.CLIENT_TOKEN);
