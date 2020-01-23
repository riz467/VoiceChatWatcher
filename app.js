const Eris = require("eris");
// BOT_TOKENには先程取得したTokenを入れてください。
const bot = new Eris(
  "NjY5MTgwOTg0ODQ3MTA2MDc3.Xig2hQ.6UNmSUjkORcQ0GRjHf6Nf_7NnGg"
);

// Botの準備が整ったらコンソールに通知
bot.on("ready", () => {
  console.log("Ready!");
  const status = {};
  const guild = bot.guilds.get("464290674305531905");
  let members = guild.members.filter(function(value) {
    return !value.bot;
  });

  let json = JSON.stringify(members);
  json = JSON.parse(json);
  json[0].cooldown = true;
  json[1].cooldown = true;

  console.log(json);

  //関数化して値渡すとFalseで返したい
  json.filter(function(item, index) {
    if (item.id === member.id) {
      item.cooldown = false;
      console.log(item.cooldown);
    }
  });
});

bot.on("voiceChannelJoin", (member, newChannel) => {
  const textChannel = newChannel.guild.channels.find(
    channel => channel.type === 0
  );
  const msg = `${member.username} が通話をはじめました`;
  bot.createMessage(textChannel.id, msg);
});

// voiceChannelLeave というイベントは
// ユーザが音声チャンネルから退出した時に発火します。
bot.on("voiceChannelLeave", (member, oldChannel) => {
  const textChannel = oldChannel.guild.channels.find(
    channel => channel.type === 0
  );
  const msg = `${member.username} が通話をやめました`;
  bot.createMessage(textChannel.id, msg);
});

// BotをDiscordに接続します
bot.connect();
