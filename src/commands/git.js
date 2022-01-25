const { emojis } = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: [],
    name: "git",
    help: "git [kullanıcı]",
    description: "Belirttiğiniz üyenin odasına gidersiniz",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.voice.channelID) return message.channel.send(embed.setDescription("Bir ses kanalında olmalısın!"));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(embed.setDescription("Bir kullanıcı belirtmelisin!"));
    if (!member.voice.channelID) return message.channel.send(embed.setDescription("Bu kullanıcı herhangi bir ses kanalında bulunmuyor!"));
    if (message.member.voice.channelID === member.voice.channelID) return message.channel.send(embed.setDescription("Zaten aynı kanaldasınız!"));
    const question = await message.channel.send(member.toString(), { embed: embed.setDescription(`${member}, ${message.author} \`${member.voice.channel.name}\` odasına gelmek istiyor. Kabul ediyor musun?`) });
    await question.react(emojis.mark);
    await question.react(emojis.cross);
    const answer = await question.awaitReactions((reaction, user) => [emojis.mark, emojis.cross].includes(reaction.emoji.toString()) && user.id === member.user.id, { max: 1, time: 60000, errors: ["time"] }).catch(() => { question.edit(embed.setDescription("İşlem iptal edildi!")) });
    if (answer.first().emoji.toString() === emojis.mark) {
      embed.setColor("GREEN");
      question.edit(embed.setDescription(`${member}, <@${message.author.id}> isteğini kabul etti`));
      message.member.voice.setChannel(member.voice.channel);
    } else {
      embed.setColor("RED");
      question.edit(embed.setDescription(`${member} odaya çekilme teklifini reddetti`));
    }
  },
};
