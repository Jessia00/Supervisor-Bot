const regstats = require("../schemas/registerStats");
const ayar = require("../configs/config.json")
const taggesLimit = new Map();
const moment = require("moment")
moment.locale("tr");
const { emojis } = require("../configs/config.json");
const settings = require("../configs/settings.json")
module.exports = {
  conf: {
    aliases: ["tagges", "t", "family"],
    name: "tagges",
    help: "tagges",
    description: "Kullanıcıya tagges rolü verir",
  },
  run: async (client, message, args, embed, prefix) => { 
    if (!message.member.hasPermission("ADMINISTRATOR") && ayar.registration.register.some(s => !message.member.roles.cache.has(s))) return message.channel.send(embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin! ${ayar.emojis.cross}`))
    let member = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]))

    if (!member) return message.channel.send(embed.setDescription(`${message.member}, Geçerli bir üye belirtmelisin. ${emojis.cross}`))
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.member}, Kendine vip veremezsin! ${emojis.cross}`))
    if (member.user.bot) return message.channel.send(embed.setDescription(`${message.member}, belirttiğin üye bir bot olamaz! ${emojis.cross}`))
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription(`${message.member}, Belirttiğin üye senden üst/aynı pozisyonda! ${ayar.emojis.cross}`))
    if (ayar.registration.taggeslimit > 0 && taggesLimit.has(message.author.id) && taggesLimit.get(message.author.id) == ayar.registration.taggeslimit) return message.channel.send(`Saatlik vip verme sınırına ulaştın! ${ayar.emojis.cross}`).then(x=>x.delete({timeout:5000}))

    if (member.roles.cache.has(ayar.registration.tagRoles)) {
        await member.roles.remove(ayar.registration.tagRoles).catch(err => {});
        message.channel.send(embed.setDescription(`${member}, üyesinden <@&${ayar.registration.tagRoles}> rolü alındı. ${emojis.mark}`))

    } else {

        await member.roles.add(ayar.registration.tagRoles).catch(err => {});
        message.channel.send(embed.setDescription(`${member}, üyesine <@&${ayar.registration.tagRoles}> rolü verildi. ${emojis.mark}`))
    }
    message.react(ayar.emojis.mark).catch(e => {})
   if (ayar.registration.taggeslimit > 0) {
      if (!taggesLimit.has(message.author.id)) taggesLimit.set(message.author.id, 1);
      else taggesLimit.set(message.author.id, taggesLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (taggesLimit.has(message.author.id)) taggesLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};