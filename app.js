const Eris = require("eris");
// BOT_TOKENには先程取得したTokenを入れてください。
const bot = new Eris(
  "NjY5MTgwOTg0ODQ3MTA2MDc3.Xig2hQ.6UNmSUjkORcQ0GRjHf6Nf_7NnGg"
);

let members, json;

// Botの準備が整ったらコンソールに通知
bot.on("ready", () => {
  console.log("Ready!");
  const status = {};
  const guild = bot.guilds.get("464290674305531905");
  members = guild.members.filter(function(value) {
    return !value.bot;
  });

  json = JSON.stringify(members);
  json = JSON.parse(json);
  json[0].cooldown = true;
  json[1].cooldown = true;

  console.log(json);
});

// 入室
bot.on("voiceChannelJoin", (member, newChannel) => {
  const textChannel = newChannel.guild.channels.find(
    channel => channel.type === 0
  );
  const msg = `${member.username} が通話をはじめました`;
//jsonからIDを検索してcooldownの値をチェックしてtrueならメッセージ送信
  json.filter(function(item, index) {
    if (item.id === member.id && item.cooldown === true) {
      bot.createMessage(textChannel.id, msg); //メッセージ送信
    }
  });
});

// 退室
bot.on("voiceChannelLeave", (member, oldChannel) => {
  const textChannel = oldChannel.guild.channels.find(
    channel => channel.type === 0
  );
  const msg = `${member.username} が通話をやめました`;
  //IDが一致するユーザーのcooldownをFalseにして、1分後Trueにする予定
  json.filter(function(item, index) {
    if (item.id === member.id && item.cooldown === true) {
      bot.createMessage(textChannel.id, msg);
      item.cooldown = false;
      console.log(item.cooldown);
      //console.log(json);
    }
  });
});

// BotをDiscordに接続します
bot.connect();
