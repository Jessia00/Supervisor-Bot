const conf = require("../configs/config.json")
const { emojis } = require("../configs/config.json");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  conf: {
    aliases: ["nerede", "n","sestemi", "kontrol"],
    name: "nerede",
    help: "nerede"
  },

  run: async (client, message, args, embed) => {
    if(!conf.registration.register.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
      message.channel.sendsend(embed.setDescription(`Yetkin bulunmamakta.`))
    return
    }
    const channel = message.guild.channels.cache.get(args[0]);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (channel) {
      message.channel.sendEmbed(embed.setDescription(`
\`${channel.name}\` adlı kanaldaki üyelerin ses bilgileri:
      `));
    } else {
      embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }));
      if (!member.voice.channel) return message.channel.send(`${emojis.cross} ${member.toString()} üyesi herhangi bir ses kanalında bulunmuyor!`);

      message.channel.send(embed.setDescription(`
${member.toString()} üyesi **${member.voice.channel.name}** kanalında.
─────────────────
• \`Mikrofonu:\` ${member.voice.mute ? `Kapalı ${emojis.cross}` : `Açık ${emojis.mark}`}
• \`Kulaklığı:\` ${member.voice.deaf ? `Kapalı ${emojis.cross}` : `Açık ${emojis.mark}`}`));
    }
  },
};