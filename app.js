const Eris = require("eris");
// BOT_TOKENには先程取得したTokenを入れてください。
const bot = new Eris(
  "NjY5MTgwOTg0ODQ3MTA2MDc3.Xig2hQ.6UNmSUjkORcQ0GRjHf6Nf_7NnGg"
);

// Botの準備が整ったらコンソールに通知
bot.on("ready", () => {
  console.log("Ready!");
  const guild = bot.guilds.get("464290674305531905");
  let members = guild.members.filter(function(value){ return !value.bot });
  console.log(members);
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