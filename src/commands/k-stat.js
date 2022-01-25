const regstats = require("../schemas/registerStats");
const ayar = require("../configs/config.json")
module.exports = {
  conf: {
    aliases: ["kayıtlar", "teyitbilgi", "stat"],
    name: "teyitler",
    help: "teyitler",
    description: "Toplam kayıt bilginizi gösterir",
  },
  run: async (client, message, args, embed, prefix) => { 
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!ayar.registration.register.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.channel.send(`Bu işlem için gerekli yetkiniz bulunmamakta.`).then(x=> x.delete({timeout: 5000})) 
    return }
    if (args[0] === "top") {
      let registerTop = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

      if (!registerTop.length) 
      {
      message.channel.send("Herhangi bir kayıt verisi bulunamadı!").then(x=>x.delete({timeout:5000})) 
      return }
      registerTop = registerTop.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 10);
      message.channel.send(embed.setDescription(registerTop.map((x, i) => `\`${i + 1}.\` <@${x.userID}> Toplam **${x.top}** (\`${x.erkek} Erkek, ${x.kız} Kız\`)`)));
    } else if (!args[0]) {
      const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
message.channel.send(embed.setDescription(` 
\`\`\`fix
• Toplam kayıt bilgisi: ${data ? data.top : 0}
• Toplam erkek kayıt bilgisi: ${data ? data.erkek : 0}
• Toplam kız kayıt bilgisi: ${data ? data.kız : 0}
\`\`\``));
    }
  },
};