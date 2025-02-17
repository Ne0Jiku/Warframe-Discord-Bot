const axios = require('axios');
// const client = require('../index.js');
require('dotenv').config();

let statusMessageId = null;

async function getOpenWorldStatus() {
    const response = await axios.get('https://api.warframestat.us/pc/');
    const cycles = response.data;
    // console.log(cycles);

    const cetus = cycles.cetusCycle;
    const vallis = cycles.vallisCycle;
    const cambion = cycles.cambionCycle;

    const cetusState = cetus.isDay ? 'Day' : 'Night';
    const vallisState = vallis.isWarm ? 'Warm' : 'Cold';
    const cambionState = cambion.active === 'fass' ? 'Fass' : 'Vome';

    const message = `
        **Cetus (Plaines d'Eidolon)** : ${cetusState} (se termine dans ${cetus.timeLeft})
        **Orb Vallis** : ${vallisState} (se termine dans ${vallis.timeLeft})
        **Cambion Drift** : ${cambionState} (se termine dans ${cambion.timeLeft})
        `;
    console.log(message);
    // await interaction.reply(message);
    return message;
}

async function sendStatusToDiscord(client) {
    if (!client || !client.channels) {
        console.error("Erreur : client ou client.channels est undefined.");
        return;
    }

    const statusMessage = await getOpenWorldStatus();
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    if (!channel) {
        console.error("Erreur: Impossible de trouver le channel.");
        return;
    }

    if (statusMessageId) {
        try {
            const message = await channel.messages.fetch(statusMessageId);
            await message.edit(statusMessage);
            console.log('Message mis à jour avec succès');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du message:', error);
        }
    } else {
        try {
            const message = await channel.send(statusMessage);
            statusMessageId = message.id;
            console.log('Message envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    }
}

function startRealTimeUpdates(client, interval = 60000) { // Default interval is 60 seconds
    setInterval(async () => {
        await sendStatusToDiscord(client);
    }, interval);
}

module.exports = { startRealTimeUpdates, sendStatusToDiscord };