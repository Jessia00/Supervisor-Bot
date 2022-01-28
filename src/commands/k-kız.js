const conf = require("../configs/config.json")
const ayar = require("../configs/config.json")
const toplams = require("../schemas/toplams");
const Ayarlar = require("../configs/config.json");
const kayitg = require("../schemas/kayitgorev");
const settings = require("../configs/settings.json")
const isimler = require("../schemas/names");
const regstats = require("../schemas/registerStats");
const { emojis } = require("../configs/config.json");
const moment = require("moment")
moment.locale("tr")


module.exports = {
  conf: {
    aliases: ["kız", "k", "woman"],
    name: "kız",
    help: "kız [üye] [isim] [yaş]",
    description: "Belirttiğiniz kişiyi erkek olarak kayıt eder",
  },
run: async (client, message, args, embed) => { 
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ayar.registration.register.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.channel.send(embed.setDescription(`Bu işlem için gerekli yetkiniz bulunmamakta.`)).then(x=> x.delete({timeout: 5000})) 
    return }
    if(!uye) 
    {
    message.channel.send(embed.setDescription(`**${settings.prefix}e @aspect/ID isim yaş**`)).then(x=>x.delete({timeout:5000})) 
    return }
    if(message.author.id === uye.id) 
    {
    message.channel.send(embed.setDescription(`**Kendini kayıt edemezsin.**`)).then(x => x.delete({timeout: 5000})); 
    return }
    if(!uye.manageable) 
    {
    message.channel.send(embed.setDescription(`**Böyle birisini kayıt edemiyorum.**`)).then(x => x.delete({timeout: 5000})); 
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.channel.send(embed.setDescription(`**Senden yüksekte olan birisini kayıt edemezsin.**`)).then(x => x.delete({timeout: 5000})); 
    return }
    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim && !yaş) 
    {
    message.channel.send(embed.setDescription(`**${settings.prefix}e @aspect/ID isim yaş**`)).then(x=>x.delete({timeout:5000})) 
    return }
    if(ayar.registration.manRoles.some(oku => uye.roles.cache.has(oku)) && ayar.registration.womanRoles.some(oku => uye.roles.cache.has(oku))) { 
      message.react(ayar.emojis.cross)
      message.channel.send(embed.setDescription(`**Üye zaten kayıtlı!**`)).then(x=>x.delete({timeout: 5000}));
      return }
      let dataa = await regstats.findOne({ guildID: message.guild.id })
if (dataa && dataa.tagMode === true) {
    if (ayar.registration.tagges.some(s => !uye.user.tag.includes(s) || !uye.user.username.includes(s)) && !uye.roles.cache.has(ayar.registration.vipRoles) && !uye.roles.cache.has(ayar.registration.tagRoles) && !uye.roles.cache.has(ayar.registration.booster))
     return message.channel.send(embed.setDescription(`${uye}, Adlı kullanıcıda tag bulunmadığı için işlem gerçekleştirilemedi.`))
 }
    if(!yaş) 
    { setName = `${uye.user.username.includes(ayar.registration.tag) ? ayar.registration.tag : (ayar.registration.ikinciTag ? ayar.registration.ikinciTag : (ayar.registration.tag || ""))} ${isim}`;
    } else { setName = `${uye.user.username.includes(ayar.registration.tag) ? ayar.registration.tag : (ayar.registration.ikinciTag ? ayar.registration.ikinciTag : (ayar.registration.tag || ""))} ${isim} | ${yaş}`;
  } uye.setNickname(`${setName}`).catch(err => message.channel.send(`**İsim çok uzun.**`))
    const datas = await regstats.findOne({ guildID: message.guild.id, userID: message.member.id });
message.channel.send(embed.setDescription(`
${uye.toString()} üyesinin ismi \`"${setName}"\` olarak değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.

${emojis.cross} Üyesinin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu

${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "Daha önce kayıt olmamış."}
`)
.setFooter(`İşlemi gerçekleştiren yetkili: ${message.member.displayName}`)
.setAuthor(uye.displayName, uye.user.displayAvatarURL({ dynamic: true }))
.setThumbnail(uye.user.displayAvatarURL({ dynamic: true, size: 2048 })))
    await uye.roles.add(ayar.registration.womanRoles)
    await uye.roles.remove(ayar.registration.unregRoles)
    await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
    await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, kız: 1, kız24: 1, kız7: 1, kız14: 1, }, }, { upsert: true });
    await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: ayar.registration.womanRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (kayitgData)
    {
    await kayitg.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { kayit: 1 } }, { upsert: true });
    }
    if (uye.user.username.includes(ayar.registration.tag)) uye.roles.add(ayar.registration.tagRoles)
if(ayar.registration.chatChannels && client.channels.cache.has(ayar.registration.chatChannels)) client.channels.cache.get(ayar.registration.chatChannels).send(`Aramıza hoşgeldin **${uye}**! Kuralları okumayı unutma!`).then(x => x.delete({timeout: 10000})) 

}   }
