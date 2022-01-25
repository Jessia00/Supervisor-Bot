const ayar = require("../configs/config.json")
const { emojis } = require("../configs/config.json")
module.exports = {
	conf: {
		aliases: [],
		name: "say",
		help: "say"
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
		let toplam = message.guild.memberCount;
		let ses = message.guild.members.cache.filter(x => x.voice.channel).size;
		let taglı = message.guild.members.cache.filter(x => x.user.username.includes(ayar.registration.tag)).size;
		let aktif = message.guild.members.cache.filter(x => x.presence.status !== "offline").size;
		let boost = message.guild.premiumSubscriptionCount;
		let boostlevel = message.guild.premiumTier;
message.channel.send(embed.setDescription(`
\`•\` **Sunucumuzda toplam __\`${toplam}\`__ üye var ${aktif} çevrimiçi.**
 \`⤷\` **Toplam __\`${taglı}\`__ kişi tagımıza sahip.**
 \`⤷\` **Seste toplam __\`${ses}\`__ kullanıcı var.**
 \`⤷\` **Sunucumuza toplam __\`${boost}\`__ takviye yapılmış, ${boostlevel} seviye.**`));
	}
};
