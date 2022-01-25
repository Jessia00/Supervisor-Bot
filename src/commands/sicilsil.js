const penals = require("../schemas/penals");
const ayar = require("../configs/config.json")
const conf = require("../configs/config.json")
const {emojis} = require("../configs/config.json")
const moment = require("moment")
moment.locale("tr");
module.exports = {
  conf: {
    aliases: ["sicilsıfırla","siciltemizle"],
    name: "sicilsil",
    help: "sicilsil",
    description: "Belirttiğiniz kullanıcının sicilini siler",
  },

  run: async (client, message, args, embed, prefix) => {
if (!message.member.hasPermission('ADMINISTRATOR'))
{
message.channel.send("*Bu işlemi yapamazsın dostum!**").then(x=>x.delete({timeout: 5000}))
return;
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member)
{
message.channel.send("**Sicilini sıfırlamamı istediğin kişiyi etiketle!**").then(x=>x.delete({timeout:5000}))
return;
}
const penalData = await penals.findOne({userID: member.user.id, guildID: message.guild.id}).sort({ date: -1 });
if(penalData === 1)
{
message.channel.send(`**${member} kişisinin sicili zaten temiz!**`)
return;
}
message.channel.send(`**${emojis.mark} ${member} üyesinin sicili ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde temizlendi!**`)
await penals.deleteMany({})
}
};
