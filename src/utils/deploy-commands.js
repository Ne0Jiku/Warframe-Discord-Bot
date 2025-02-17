require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

async function deploy_command() {
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    try {
        console.log('Suppression des commandes existantes...');

        const existingCommands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
        );

        for (const command of existingCommands) {
            await rest.delete(
                Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, command.id)
            );
        }

        console.log('Commandes existantes supprimées avec succès.');

        console.log('Enregistrement des nouvelles commandes...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('Nouvelles commandes enregistrées avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes:', error);
    }
}

module.exports = { deploy_command };