require("dotenv").config();
const Eris = require("eris");
const bot = new Eris(process.env.TOKEN);

let members, json;
const sendtextchannel = process.env.SEND_TEXT_CHANNEL; //送信するテキストチャンネル
const serverid = process.env.SERVER_ID; //サーバーID
const waittime = process.env.WAIT_TIME; //待機時間(ミリ秒)

bot.on("ready", () => {
  console.log("Ready!");
  const guild = bot.guilds.get(serverid);
  members = guild.members.filter(function(value) {
    return !value.bot;
  });

  json = JSON.stringify(members);
  json = JSON.parse(json);
  for (let i = 0; i < json.length; i++) {
    json[i].cooldown = false;
  }

  //console.log(json);
  //const testch = guild.channels.filter(channel => channel.type === 0); //これでテキストチャンネル一覧が取れる、ボイスチャンネルは2
});

// 入室
bot.on("voiceChannelJoin", (member, newChannel) => {
  const textChannel = newChannel.guild.channels.find(
    channel => channel.id === sendtextchannel
  );
  const msg = `${member.username}が${newChannel.name}に入室しました`;
  //jsonからIDを検索してcooldownの値をチェックしてfalseならメッセージ送信
  json.filter(function(item, index) {
    if (item.id === member.id && item.cooldown === false) {
      bot.createMessage(textChannel.id, msg); //メッセージ送信
    }
  });
});

// 退室
bot.on("voiceChannelLeave", (member, oldChannel) => {
  const textChannel = oldChannel.guild.channels.find(
    channel => channel.id === sendtextchannel
  );
  const msg = `${member.username}が${oldChannel.name}から退室しました`;
  //IDが一致するユーザーのcooldownをFalseにして、n分後Trueにする
  json.filter(function(item, index) {
    if (item.id === member.id && item.cooldown === false) {
      bot.createMessage(textChannel.id, msg);
      item.cooldown = true;
      console.log(`${member.username}を${item.cooldown}にしました`);
      setTimeout(function() {
        item.cooldown = false;
        console.log(`${member.username}を${item.cooldown}に戻しました`);
      }, waittime);
    }
  });
});

bot.connect();
