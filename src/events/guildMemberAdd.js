const client = global.client;
const { Collection } = require("discord.js");
const regstats = require("../schemas/registerStats");
const conf = require("../configs/config.json")
const ayar = require("../configs/config.json")
const settings = require("../configs/settings.json")
const moment = require("moment");
const bannedTag = require("../schemas/bannedTag");
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const { emojis } = require("../configs/config.json")


module.exports = async (member, message, embed) => {
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
  if (guvenilirlik) {
  if(ayar.registration.fakeAccRole) member.roles.add(ayar.registration.fakeAccRole).catch();
  } else if(ayar.registration.unregRoles) member.roles.add(ayar.registration.unregRoles).catch();
  if (member.user.username.includes(ayar.registration.tag)) { member.setNickname(`${ayar.registration.tag} İsim | Yaş`).catch(); }
  else { member.setNickname(`${ayar.registration.ikinciTag} İsim | Yaş`).catch();}


  if (member.user.username.includes(ayar.registration.tag)) {
    await member.roles.add(ayar.registration.tagRoles)
    await member.roles.add(ayar.registration.unregRoles)
  client.channels.cache.get(ayar.registration.taglog).send(`<@${member.id}> (\`${member.id}\`) adlı kişi sunucumuza taglı şekilde katıldı, isminde ${ayar.registration.tag} sembolü bulunuyor.`)
  }


let memberGün = moment(member.user.createdAt).format("DD");
let memberTarih = moment(member.user.createdAt).format("YYYY HH:mm:ss");
let memberAylar = moment(member.user.createdAt).format("MM").replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık");
let üyesayısı = member.guild.members.cache.size.toString().replace(/ /g, "    ")
  

const welcomechannel = member.guild.channels.cache.get(ayar.registration.welcomeChannels);
const kurallar = member.guild.channels.cache.get(ayar.registration.rulesChannels);


welcomechannel.wsend(`
:tada: Sunucumuza hoş geldin ${member} (\`${member.id}\`)
Seninle beraber **${üyesayısı}** kişi olduk!

Hesabın ${memberGün} ${memberAylar} ${memberTarih} tarihinde oluşturulmuş. ${guvenilirlik ? `Şüpheli! ${emojis.cross}` : `Güvenli! ${emojis.mark}` }

Sunucumuza kayıt olabilmek için \`V. Confirmed\` odalarından birine girip <@&${ayar.registration.register}> yetkilisine isim yaş belirtmen gerekmektedir.

Sunucu kurallarımız ${kurallar} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.`);

};

module.exports.conf = {
  name: "guildMemberAdd",
};
