const { MessageEmbed } = require("discord.js");
const client = global.client;
const bannedTag = require("../schemas/bannedTag");
const conf = require("../configs/config.json");
const settings = require("../configs/settings.json")
const regstats = require("../schemas/registerStats");

module.exports = async (oldUser, newUser) => {
    if (oldUser.bot || newUser.bot || (oldUser.username === newUser.username)) return;
    const guild = client.guilds.cache.get(conf.guildID);
    if (!guild) return;
    const member = guild.members.cache.get(oldUser.id);
    if (!member) return;
    const channel = guild.channels.cache.get(conf.registration.taglog);
    const kanal = guild.channels.cache.get(conf.registration.chatChannels)
    if (oldUser.username.includes(conf.registration.tag) && !newUser.username.includes(conf.registration.tag)) {
   const tagModedata = await regstats.findOne({ guildID: conf.guildID })
    if (tagModedata && tagModedata.tagMode === true) {
   if(!member.roles.cache.has(conf.registration.vipRoles) && !member.roles.cache.has(conf.registration.booster)) return member.roles.set(conf.registration.unregRoles);
}
      else member.roles.remove(conf.registration.tagRoles);

  let ekip = member.guild.roles.cache.get(conf.registration.tagRoles);

    if (!conf.registration.register) {
    if (member.roles.cache.has(ekip.id)) member.roles.remove(ekip.id).catch(console.error);
	  let roles = member.roles.cache.clone().filter(e => e.managed || e.position < ekip.position);
    member.roles.set(roles).catch();
    } else {
      let roles = member.roles.cache.clone().filter(e => e.managed).map(e => e.id);
	  roles.concat(conf.registration.unregRoles);
     member.roles.set(roles).catch();
    }

      if (!channel) return;
      const embed = new MessageEmbed()
        .setAuthor(member.displayName,  newUser.displayAvatarURL({ dynamic: true }))
        .setTitle("• Bir kullanıcı tag saldı!")
        .setColor("#2f3136")
        .setDescription(`
${member.toString()} kullanıcısı ${conf.registration.tag} tagını saldığı için <@&${conf.registration.tagRoles}> rolü alındı.
Aktif taglı sayısı: ${guild.members.cache.filter(x => x.user.username.includes(conf.registration.tag)).size}
         `);
      channel.wsend(embed);
      } else if (!oldUser.username.includes(conf.registration.tag) && newUser.username.includes(conf.registration.tag)){
      member.roles.add(conf.registration.tagRoles);
      if (!channel) return;
      const embed = new MessageEmbed()
        .setAuthor(member.displayName, newUser.displayAvatarURL({ dynamic: true }))
        .setTitle("• Bir kullanıcı tag aldı!")
        .setColor("#2f3136")
        .setDescription(`
${member.toString()} kullanıcısı ${conf.registration.tag} tagını aldığı için <@&${conf.registration.tagRoles}> rolü verildi.
Aktif taglı sayısı: ${guild.members.cache.filter(x => x.user.username.includes(conf.registration.tag)).size}
    `);
      channel.wsend(embed);
      kanal.wsend(new MessageEmbed().setColor("#2f3136").setDescription(`${member.toString()} üyesi ${conf.registration.tag} tagımızı alarak ailemize katıldı! Ailemiz ${guild.members.cache.filter(x => x.user.username.includes(conf.registration.tag)).size} kişi oldu!`)).then(x=>x.delete({timeout: 5000}))

    }

};

module.exports.conf = {
  name: "userUpdate",
};
