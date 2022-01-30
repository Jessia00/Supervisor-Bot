const { Client, Collection } = require("discord.js");
const client = (global.client = new Client({ fetchAllMembers: true }));
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

client.on("userUpdate", async (stg, yeni) => {
  var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
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

