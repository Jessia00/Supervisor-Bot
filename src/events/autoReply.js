const conf = require("../configs/config.json")

module.exports = async (message) => {
  if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
    message.channel.send(conf.registration.tag);
    }

    if (message.content.toLowerCase() === "sa" || message.content.toLowerCase() === "Selamun Aleyküm" || message.content.toLowerCase() === "selam") {
    message.channel.send(`**${message.author}, Aleyküm Selam Hoş geldin.**`);
  }
};
module.exports.conf = {
  name: "message"
};