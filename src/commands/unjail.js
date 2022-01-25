const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const penals = require("../schemas/penals");

module.exports = {
  conf: {
    aliases: [],
    name: "unjail",
    help: "unjail [kullanıcı]",
    description: "Belirttiğiniz kullanıcının jailini kaldırır",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.jail.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.send(embed.setDescription("Yeterli yetkin bulunmuyor!"));
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(embed.setDescription("Bir üye belirtmelisin!"));
    if (!conf.penals.jail.roles.some(x => member.roles.cache.has(x))) return message.channel.send(embed.setDescription("Bu üye jailde değil!"));
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription("Kendinle aynı yetkide ya da daha yetkili olan birinin jailini kaldıramazsın!"));
    if (!member.manageable) return message.channel.send(embed.setDescription("Bu üyeyi jailden çıkaramıyorum!"));

    member.setRoles(conf.registration.unregRoles);
    const data = await penals.findOne({ userID: member.user.id, guildID: message.guild.id, $or: [{ type: "JAIL" }, { type: "TEMP-JAIL" }], active: true });
    if (data) {
      data.active = false;
      await data.save();
    }
    message.channel.send(embed.setDescription(`${member.toString()} üyesinin jaili ${message.author} tarafından kaldırıldı!`));
    if (conf.dmMessages) member.send(`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, jailiniz kaldırıldı!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("GREEN")
      .setDescription(`
${member.toString()} üyesinin jaili kaldırıldı!

Jaili Kaldırılan Üye: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Jaili Kaldıran Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Jailin Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
      `)
    message.guild.channels.cache.get(conf.penals.jail.log).send(log);
  },
};
