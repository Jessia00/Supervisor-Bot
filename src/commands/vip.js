const regstats = require("../schemas/registerStats");
const ayar = require("../configs/config.json")
const vipLimit = new Map();
const moment = require("moment")
moment.locale("tr");
const settings = require("../configs/settings.json")
module.exports = {
  conf: {
    aliases: ["vip", "v", "vıp"],
    name: "vip",
    help: "vip",
    description: "Belirttiğiniz kullanıcıya vip rolü verir",
  },
  run: async (client, message, args, embed, prefix) => { 
    if (!message.member.hasPermission("ADMINISTRATOR") && ayar.registration.register.some(s => !message.member.roles.cache.has(s))) return message.channel.send(embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin! ${ayar.emojis.cross}`))
    let member = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]))

    if (!member) return message.channel.send(embed.setDescription(`${message.member}, Geçerli bir üye belirtmelisin. ${ayar.emojis.cross}`))
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.member}, Kendine vip veremezsin! ${ayar.emojis.cross}`))
    if (member.user.bot) return message.channel.send(embed.setDescription(`${message.member}, belirttiğin üye bir bot olamaz! ${ayar.emojis.cross}`))
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription(`${message.member}, Belirttiğin üye senden üst/aynı pozisyonda! ${ayar.emojis.cross}`))
    if (ayar.registration.viplimit > 0 && vipLimit.has(message.author.id) && vipLimit.get(message.author.id) == ayar.registration.viplimit) return message.channel.send(`Saatlik vip verme sınırına ulaştın! ${ayar.emojis.cross}`).then(x=>x.delete({timeout:5000}))

    if (member.roles.cache.has(ayar.registration.vipRoles)) {
        await member.roles.remove(ayar.registration.vipRoles).catch(err => {});
        message.channel.send(embed.setDescription(`${member}, üyesinden <@&${ayar.registration.vipRoles}> rolü alındı. ${ayar.emojis.mark}`))

    } else {

        await member.roles.add(ayar.registration.vipRoles).catch(err => {});
        message.channel.send(embed.setDescription(`${member}, üyesine <@&${ayar.registration.vipRoles}> rolü verildi. ${ayar.emojis.mark}`))
    }
    message.react(ayar.emojis.mark).catch(e => {})
   if (ayar.registration.viplimit > 0) {
      if (!vipLimit.has(message.author.id)) vipLimit.set(message.author.id, 1);
      else vipLimit.set(message.author.id, vipLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vipLimit.has(message.author.id)) vipLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};