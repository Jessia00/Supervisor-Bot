const ayar = require("../configs/config.json");
module.exports = {
    conf: {
      aliases: ["zengin","booster"],
      name: "zengin",
      help: "zengin",
      description: "Boosterlerin isim değiştirmesine yardımcı olur",
    },
  
run: async (client, message, args) => {
    const booster = ayar.registration.booster || undefined;
    if (!booster) 
    {
    message.react(ayar.emojis.cross);
    message.channel.send("Booster değilsin!").then(x => x.delete({timeout: 5000})); 
    return }
    if (!message.member.roles.cache.has(booster)) 
    {
    message.react(ayar.emojis.cross);
    message.channel.send("Bu Komutu Kullanabilmek İçin Booster Olmalısın!").then(x=> x.delete({timeout: 5000}));
    return }
    const uye = message.guild.members.cache.get(message.author.id);
    const isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    const boostt;
    if (!isim) 
    {
    message.react(ayar.emojis.cross);
    message.channel.send("Geçerli bir isim belirtmelisin!").then(x => x.delete({timeout: 5000})); 
    return }
    boostt = `${uye.user.username.includes(ayar.registration.tag) ? ayar.registration.tag : (ayar.registration.ikinciTag ? ayar.registration.ikinciTag : (ayar.registration.tag || ""))} ${isim}`;
    uye.setNickname(`${boostt}`).catch(); 
    message.react(ayar.emojis.mark);
    message.channel.send(`Başarıyla ismini \`"${boostt}"\` olarak değiştirdim!`).then(x => x.delete({timeout: 5000}));
},
  };
  
  
