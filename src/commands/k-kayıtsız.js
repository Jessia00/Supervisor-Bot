const ayar = require("../configs/config.json")
const { emojis } = require("../configs/config.json");
const conf = require("../configs/config.json")
const kayıtsızLimit = new Map();
const moment = require("moment")
moment.locale("tr");
const settings = require("../configs/settings.json")

module.exports = {
  conf: {
    aliases: ["kayıtsız","ks","kayitsiz","unreg","unregister"],
    name: "kayıtsız",
    help: "kayıtsız",
    description: "Üyeyi kayıtsıza atar",
  },
  run: async (client, message, args, embed, prefix) => { 
    if(!ayar.registration.register.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.channel.send(`Bu işlem için gerekli yetkiniz bulunmamakta.`).then(x=> x.delete({timeout: 5000})) 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
    message.channel.send("**Bir üye belirtmelisin!**").then(x=>x.delete({timeout:5000})) 
    return }
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) 
    {
    message.channel.send("**Kendinle aynı yetkide ya da daha yetkili olan birini kayıtsıza atamazsın!**").then(x=>x.delete({timeout:5000})) 
    return }
    if (!member.manageable) 
    {
    message.channel.send("**Bu üyeyi kayıtsıza atamıyorum!**").then(x=>x.delete({timeout:5000})) 
    return }
   if (ayar.registration.kayıtsızlimit > 0 && kayıtsızLimit.has(message.author.id) && kayıtsızLimit.get(message.author.id) == ayar.registration.kayıtsızlimit) 
    {
  return message.channel.send(`**Saatlik kayıtsız atma sınırına ulaştın!**`).then(x=>x.delete({timeout:5000}))
    }

    member.roles.set(conf.registration.unregRoles);
    member.setNickname(`${ayar.registration.ikinciTag} İsim | Yaş`)
    message.channel.send(`${member} üyesi, ${message.author} tarafından, kayıtsıza atıldı! ${emojis.mark}`).then(x=>x.delete({timeout:5000}))
 

    if (ayar.registration.kayıtsızlimit > 0) {
      if (!kayıtsızLimit.has(message.author.id)) kayıtsızLimit.set(message.author.id, 1);
      else kayıtsızLimit.set(message.author.id, kayıtsızLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (kayıtsızLimit.has(message.author.id)) kayıtsızLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};