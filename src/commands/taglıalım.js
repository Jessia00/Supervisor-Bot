const Discord = require("discord.js");
const registerData  = require("../schemas/registerStats");

module.exports = {
    conf: {
      aliases: ["taglıalım","taglı-alım"],
      name: "taglı-alım",
      help: "taglı-alım [aç/kapat]"
    },

  run: async (client, message, args, embed) => {

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`))
    let data = await registerData.findOne({ guildID: message.guild.id })
    if(!data) new registerData({guildID: message.guild.id, tagMode: true}).save();
    switch (args[0]) {
        case "aç":
            if (data && data.tagMode === true) return message.channel.send(embed.setDescription(`Taglı alım modu zaten aktif!`))
            data.tagMode = true;
            data.save();
            message.channel.send(embed.setDescription(`Taglı alım modu başarıyla aktif edildi!`))
            break;
        case "kapat":
            if (data && data.tagMode === false) return message.channel.send(embed.setDescription(`Taglı alım modu zaten kapalı!`))
            data.tagMode = false;
            data.save();
            message.channel.send(embed.setDescription(`Taglı alım modu başarıyla deaktif edildi!`))
            break;
        default:
            message.channel.send(embed.setDescription(`${message.member} Hatalı kullanım! \`\`\`.taglıalım aç/kapat\`\`\``));
            break;
    }
}
}