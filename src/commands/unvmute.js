const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const penals = require("../schemas/penals");

module.exports = {
  conf: {
    aliases: [],
    name: "unvmute",
    help: "unvmute [kullanıcı]",
    description: "Belirttiğiniz kullanıcının voice-mutesini kaldırır",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.voiceMute.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.send(embed.setDescription("Yeterli yetkin bulunmuyor!"));
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(embed.setDescription("Bir üye belirtmelisin!"));
    if (!conf.penals.voiceMute.roles.some(x => member.roles.cache.has(x)) && (member.voice.channelID && !member.voice.serverMute)) return message.channel.send(embed.setDescription("Bu üye muteli değil!"));
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription("Kendinle aynı yetkide ya da daha yetkili olan birinin susturmasını kaldıramazsın!"));
    if (!member.manageable) return message.channel.send(embed.setDescription("Bu üyenin susturmasını kaldıramıyorum!"));

    member.roles.remove(conf.penals.voiceMute.roles);
    if (member.voice.channelID && member.voice.serverMute) member.voice.setMute(false);
    const data = await penals.findOne({ userID: member.user.id, guildID: message.guild.id, type: "VOICE-MUTE", active: true });
    if (data) {
      data.active = false;
      data.removed = true;
      await data.save();
    }
    message.channel.send(embed.setDescription(`${member.toString()} üyesinin **sesli kanallarda** susturması, ${message.author} tarafından kaldırıldı!`));
    if (conf.dmMessages) member.send(`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından **sesli kanallarda** olan susturmanız kaldırıldı!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("GREEN")
      .setDescription(`
${member.toString()} üyesinin **sesli kanallarda** susturması kaldırıldı!

Susturması Kaldırılan Üye: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Susturmayı Kaldıran Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Susturmanın Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
      `);
    message.guild.channels.cache.get(conf.penals.voiceMute.log).send(log);
  },
};
