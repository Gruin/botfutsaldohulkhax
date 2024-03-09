const { Client, CommandInteraction, MessageEmbed, TextInputComponent, Modal, MessageActionRow } = require("discord.js");
const syncModel = require('../../Models/syncModel');
const statsModel = require('../../Models/stats');

module.exports = {
    name: "synchax",
    description: "Sincronizar o Haxball com o discord.",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

    const stats = await statsModel.findOne({ discordID: interaction.user.id });
    if(stats) return interaction.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`Você já está vinculado com essa conta do discord **${stats.name}**`)], ephemearl: true});

    const checkSync = await syncModel.findOne({ userID: interaction.user.id });
    if(checkSync) return interaction.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`Você já tem um código pendente pra sincronizar. Use **!discordsync ${checkSync.code}** en el chat de haxball.`)], ephemeral: true })

    const code = Math.random().toString(36).substring(2, 8);
    const setCode = new syncModel({ code: code, userID: interaction.user.id });
    await setCode.save();

    const codeEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setDescription(`À partir de agora você tem 30 segundos pra sincronizar com o discord usando **!discordsync ${code}** no chat do Haxball.`)
    
    interaction.reply({ content: `**${code}**`, embeds: [codeEmbed], ephemeral: true });

    },
};