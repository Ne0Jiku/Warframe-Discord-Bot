const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios'); // Add this line to import axios

module.exports = {
    data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Show profile')
    .addStringOption(option => 
        option.setName('profile')
        .setDescription('Your profile username')
        .setRequired(true) // Fix the typo here
    ),

    async execute(interaction) {
        const response = await axios.get(`https://api.warframestat.us/pc/profile/${interaction.options.getString('profile')}/`); // Fix the typo here
        const profile = response.data;

        const message = `
        Mastery Rank: ${profile.masteryRank},
        Username: ${profile.displayName},
        `;
        await interaction.reply({content: message, ephemeral: true});
    }
}