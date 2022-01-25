const conf = require("../configs/config.json")
const settings = require("../configs/settings.json")
module.exports = {
  conf: {
    aliases: ["help", "y", "help","yardım"],
    name: "yardım",
  },

  run: async (client, message, args, embed, prefix) => {
let command = args[0]
if (client.commands.has(command)) {
command = client.commands.get(command)
message.channel.send(embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setColor("RANDOM").setDescription(`
Belirttiğin komuta ait bilgiler aşağıda verilmiştir!

\`Komut Adı\`:** ${command.conf.name}**
\`Komut Açıklaması\`**: ${command.conf.description}**
\`Komut Kullanımı\`**: ${settings.prefix}${command.conf.help}**
\`Komut Alternatifleri\`**: ${command.conf.aliases[0] ? command.conf.aliases.join(', ') : `Alternatif bulunmuyor!`}**`))
  return;
    }


let komutlars = (client.commands.filter((x) => x.conf.help).sort((a, b) => b.conf.help - a.conf.help).map((x) => ` \`${prefix}${x.conf.help}\``).splice(0, 300).join("\n"))
message.channel.send(embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`Aşağıda sunucudaki komutlar sıralandırılmıştır. Toplam \`${client.commands.size}\` tane komut kullanılabilir. Komut bilgisini detaylı öğrenmek için \`.yardım <Komut Ismi>\` komutu ile komutun detaylı bilgilerini görebilirsin.

${komutlars}`
))}
  }