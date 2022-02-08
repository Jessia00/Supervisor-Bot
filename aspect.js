const { Client, Collection } = require("discord.js");
const client = (global.client = new Client({ fetchAllMembers: true }));
require('discord-buttons')(client)
const settings = require("./src/configs/settings.json");
const ayar = require("./src/configs/config.json");
client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();
require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.token)
  .then(() => console.log("[BOT] Bot connected!"))
  .catch(() => console.log("[BOT] Bot can't connected!"));


  client.on("ready", () => {
    client.channels.cache.get("BOTUN GİRECEĞİ SESLİ KANAL").join();
   });

   
client.on ( "ready" , () => {
  console.log ( "Başarıyla", client.user.username + "İsmi İle Giriş Yapıldı!" );
  console.log("Developed by Aspect");
} );
client.on("ready", async () => {
client.user.setPresence({ activity: { name: settings.botdurum }, status: "dnd" });
});


//-----------------------TAG-ROL----------------------\\

client.on("userUpdate", async (stg, yeni,message) => {
  var member = message.mentions.members.first();
  var sunucu = client.guilds.cache.get("SUNUCU İD GİR");
  var uye = sunucu.members.cache.get(yeni.id);
  var ekipTag = ayar.registration.tag;
  var ekipRolü = ayar.registration.tagRoles;
  var logKanali = member.guild.channels.cache.get(ayar.registration.taglog);

  if (!sunucu.members.cache.has(yeni.id) || yeni.bot || stg.username === yeni.username)
    return;

  if (yeni.username.includes(ekipTag) && !uye.roles.cache.has(ekipRolü)) {
    try {
      await uye.roles.add(ekipRolü);
      await uye.send(`**Tagımızı aldığın için teşekkürler! Aramıza hoş geldin.**`);
      await client.channels.cache.get(logKanali).send(`**${yeni} (\`${yeni.id}\`) adlı üye tagımızı alarak aramıza katıldı!**`);
    } catch (err) {
      console.error(err);
    }
  }

  if (!yeni.username.includes(ekipTag) && uye.roles.cache.has(ekipRolü)) {
    try {
      await uye.roles.remove(
        uye.roles.cache.filter(
          rol => rol.position >= sunucu.roles.cache.get(ekipRolü).position
        )
      );
      await uye.send(`**Tagımızı bıraktığın için taglı rolün rolün alındı! Tagımızı tekrar alıp aramıza katılmak istersen;\nTagımız: **${ekipTag}**`);
      await client.channels.cache.get(logKanali).send(`**${yeni} (\`${yeni.id}\`) adlı üye tagımızı bırakarak aramızdan ayrıldı!**`);
    } catch (err) {
      console.error(err);
    }
  }

});


 client.on("message", (message) => {

    if (message.content !== "!rolalma" || message.author.bot) return;

    client.api.channels(message.channel.id).messages.post({ data: {"content": `Merhaba **Valence** üyeleri,\nÇekiliş katılımcısı alarak __**Nitro**__ , __**Spotify**__ , __**Netflix**__ , __**Exxen**__ , __**BluTv**__ gibi çeşitli ödüllerin sahibi olabilirsiniz.\nEtkinlik katılımcısı alarak çeşitli etkinliklerin yapıldığı anlarda herkesten önce haberdar olabilirsiniz ve çekilişlere önceden katılma hakkı kazanabilirsiniz.\n\n__Aşağıda ki butonlara basarak siz de bu ödülleri kazanmaya hemen başlayabilirsiniz!__`,
    "components":[{
        "type":1,"components":[
                                 {"type":2,"style":4,"custom_id":"cekilis","label":"🎁 Çekiliş Katılımcısı"},
                                 {"type":2,"style":3,"custom_id":"etkinlik","label":"🎉 Etkinlik Katılımcısı"},
               ]}    
]}
         })
        });

client.on('clickButton', async (button) => {
    if (button.id === 'cekilis') {
        if (button.clicker.member.roles.cache.get(ayar.Roles.cekilis)) {
            await button.clicker.member.roles.remove(ayar.Roles.cekilis)
            await button.reply.think(true);
            await button.reply.edit(`Rolleriniz güncellendi.`)
        } else {
            await button.clicker.member.roles.add(ayar.Roles.cekilis)
            await button.reply.think(true);
            await button.reply.edit(`Rolleriniz güncellendi.`)
        }
    }

    if (button.id === 'etkinlik') {
        if (button.clicker.member.roles.cache.get(ayar.Roles.etkinlik)) {
            await button.clicker.member.roles.remove(ayar.Roles.etkinlik)
            await button.reply.think(true);
            await button.reply.edit(`Rolleriniz güncellendi.`)
        } else {
            await button.clicker.member.roles.add(ayar.Roles.etkinlik)
            await button.reply.think(true);
            await button.reply.edit(`Rolleriniz güncellendi.`)
        }
    }
});
