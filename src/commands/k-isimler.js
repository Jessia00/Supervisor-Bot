const nameData = require("../schemas/names")
const conf = require("../configs/config.json")
const moment = require("moment")
moment.locale("tr")
module.exports = {
  conf: {
    aliases: [],
    name: "isimler",
    help: "isimler [kullanıcı]",
    description: "Üyenin eski isimlerini görmenize yarar",
  },
  run: async (client, message, args, embed, prefix) => { 
    if(!conf.registration.register.some(oku => message.member.roles.cache.has(oku))  && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.channel.send(`Bu işlem için gerekli yetkiniz bulunmamakta.`).then(x=> x.delete({timeout: 5000})) 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await nameData.findOne({ guildID: message.guild.id, userID: member.user.id });

    embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }));
embed.setTitle(`${member.user.username} üyesinin isim bilgileri`);
message.channel.send(embed.setDescription(`
Üyesinin toplamda **${data ? `${data.names.length}` : "0"}** isim bilgisi 
${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "İsim bilgisi bulunamadı."}`));
  }
};
