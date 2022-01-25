const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const conf = require("../configs/config.json");
module.exports = {
  conf: {
    aliases: ["seslisay", "ssay"],
    name: "sesli",
    help: "sesli",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
	if(!ayar.registration.register.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) 
{
	message.react(emojis.cross)
	message.channel.send(embed.setDescription(`Bu işlem için gerekli yetkiniz bulunmamakta.`)).then(x=> x.delete({timeout: 5000})) 
return }
  let ses = message.guild.members.cache.filter(x => x.voice.channel).size
let pub = message.guild.members.cache.filter(x => x.voice.channel).filter(x => x.voice.channel.parentID === conf.parents.pubParents).size
let priv = message.guild.members.cache.filter(x => x.voice.channel).filter(x => x.voice.channel.parentID === conf.parents.privParents).size
let alone = message.guild.members.cache.filter(x => x.voice.channel).filter(x => x.voice.channel.parentID === conf.parents.aloneParents).size
let teyit = message.guild.members.cache.filter(x => x.voice.channel).filter(x => x.voice.channel.parentID === conf.parents.regParents).size
    



message.channel.send(embed.setDescription(`
\`•\` Sesli kanallarda toplam \`${ses}\` üye bulunmakta.
 \`⤷\` Public kanallarda ${pub} üye bulunmakta.
 \`⤷\` Secret kanallarda ${priv} üye bulunmakta.
 \`⤷\` Alone kanallarda ${alone} üye bulunmakta.
 \`⤷\` Teyit kanallarda ${teyit} üye bulunmakta.
`))
    
    }
};