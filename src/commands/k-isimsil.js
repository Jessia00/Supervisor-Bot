const isim = require("../schemas/names");
const ayar = require("../configs/config.json")
const moment = require("moment")
const { emojis } = require("../configs/config.json");
moment.locale("tr")
module.exports = {
  conf: {
    aliases: ["isimsıfırla","isimtemizle"],
    name: "isimsil",
    help: "isimsil",
    description: "Üyenin eski isim bilgisini siler",
  },

  run: async (client, message, args, embed, prefix) => {
if (!message.member.hasPermission('ADMINISTRATOR'))
{
message.channel.send("Bu işlem için gerekli yetkiniz bulunmamakta.").then(x=>x.delete({timeout: 5000}))
return;
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member)
{
message.channel.send("İsim geçmişini sıfırlamamı istediğin kişiyi etiketle!").then(x=>x.delete({timeout:5000}))
return;
}
const isimData = await isim.findOne({userID: member.user.id, guildID: message.guild.id})
if(!isimData)
{
message.channel.send(`${member} kişisinin isim geçmişi zaten yok!`)
return;
}
message.channel.send(`${emojis.mark} ${member} üyesinin isim geçmişi ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde temizlendi!`)
await isim.deleteMany({userID: member.user.id, guildID: message.guild.id})
}
};