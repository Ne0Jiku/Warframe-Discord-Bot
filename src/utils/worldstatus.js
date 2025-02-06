const { axios } = require('axios');

async function getOpenWorldStatus() {
    try {
        const response = await axios.get('https://api.tenno.tools/cycles');
        const cycles = response.data;

        const cetus = cycles.cetus;
        const vallis = cycles.vallis;
        const cambion = cycles.cambion;

        const cetusState = cetus.isDay ? 'Jour' : 'Nuit';
        const vallisState = vallis.isWarm ? 'Chaud' : 'Froid';
        const cambionState = cambion.active === 'fass' ? 'Fass' : 'Vome';

        const message = `
        **Cetus (Plaines d'Eidolon)** : ${cetusState} (se termine dans ${cetus.timeLeft})
        **Orb Vallis** : ${vallisState} (se termine dans ${vallis.timeLeft})
        **Cambion Drift** : ${cambionState} (se termine dans ${cambion.timeLeft})
    `;
        await interaction.reply(message);
    } catch (error) {
        console.error('Erreur lors de la récupération des données des cycles:', error);
        return('❌ Impossible de récupérer les informations des mondes ouverts.');
    }
}

async function sendStatusToDiscord() {
    const statusMessage = await getOpenWorldStatus();

    const webhookUrl = 'https://discord.com/api/webhooks/1337038720464846868/55TyVTqmu_7Ia3xnrWayH7NzBewzfCwRtcu8I2W6LhfGQwim6TzF8D6w3f7rsZp0qczc';

    const payload = {
        const: statusMessage
    };

    try {
        await axios.post(webhookUrl, payload);
        console.log('Message envoyé avec succès');
    } catch (error) {
        console.error('C\'est qui succès ? j\'ai eu que ça :', error);
    }
}

// module.exports = getOpenWorldStatus;
module.exports = { sendStatusToDiscord };
