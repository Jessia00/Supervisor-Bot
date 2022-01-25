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
const isimLimit = new Map();

module.exports = {
  conf: {
    aliases: ["isim", "i", "nick"],
    name: "isim",
    help: "isim [üye] [isim] [yaş]",
    description: "Üyenin ismini değiştirir",
  },
run: async (client, message, args, embed, prefix) => { 
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!conf.registration.register.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.channel.send(`Bu işlem için gerekli yetkiniz bulunmamakta.`).then(x=> x.delete({timeout: 5000})) 
    return }
    if(!uye) 
    {
    message.channel.send(`**${settings.prefix}isim @aspect/ID isim yaş**`).then(x=>x.delete({timeout:5000})) 
    return }
    if(message.author.id === uye.id) 
    {
    message.channel.send(`**Kendi ismini değiştiremezsin. Booster isen \`${settings.prefix}zengin\`**`).then(x => x.delete({timeout: 5000})); 
    return }
    if(!uye.manageable) 
    {
    message.channel.send(`**Böyle birisinin ismini değiştiremiyorum.**`).then(x => x.delete({timeout: 5000})); 
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.channel.sendchannel.sendchannel.sendchannel.sendchannel.sendchannel.sendchannel.send(`**Senden yüksekte olan birisinin ismini değiştiremezsin.**`).then(x => x.delete({timeout: 5000})); 
    return }
    if (conf.registration.isimlimit > 0 && isimLimit.has(message.author.id) && isimLimit.get(message.author.id) == conf.registration.isimlimit) 
    {
  return message.channel.send(`Saatlik isim değiştirme sınırına ulaştın!`).then(x=>x.delete({timeout:5000}))
    }
    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim && !yaş) 
    {
    message.channel.send(`\`${settings.prefix}isim <@aspect/ID> <Isim> <Yaş>\``).then(x=>x.delete({timeout:5000})) 
    return }
    if(!yaş) 
    { setName = `${uye.user.username.includes(ayar.registration.tag) ? ayar.registration.tag : (ayar.registration.ikinciTag ? ayar.registration.ikinciTag : (ayar.registration.tag || ""))} ${isim}`;
    } else { setName = `${uye.user.username.includes(ayar.registration.tag) ? ayar.registration.tag : (ayar.registration.ikinciTag ? ayar.registration.ikinciTag : (ayar.registration.tag || ""))} ${isim} | ${yaş}`;
  } uye.setNickname(`${setName}`).catch(err => message.channel.send(`İsim çok uzun.`))

    message.channel.send(embed.setDescription(`
${uye.toString()} üyesinin ismi başarıyla \`"${setName}"\` olarak değiştirildi

${emojis.mark} Üyesinin toplamda **${data ? `${data.names.length}` : "0"}** isim bilgisi 
${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "İsim bilgisi bulunamadı."}
`)
.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
.setFooter(`İşlemi gerçekleştiren yetkili: ${message.member.displayName}`))

await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: setName, yetkili: message.author.id,  rol: "İsim Değiştirme", date: Date.now() } } }, { upsert: true });


    if (conf.registration.isimlimit > 0) {
      if (!isimLimit.has(message.author.id)) isimLimit.set(message.author.id, 1);
      else isimLimit.set(message.author.id, isimLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (isimLimit.has(message.author.id)) isimLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};