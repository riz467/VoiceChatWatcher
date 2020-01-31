require("dotenv").config();
const Eris = require("eris");
const bot = new Eris(process.env.TOKEN);

//.envの値をbool型に変換する
function toBoolean(leavemessage) {
  return leavemessage.toLowerCase() === "true";
}

let guild,members,json;

//.envファイルに記載
const sendtextchannel = process.env.SEND_TEXT_CHANNEL; //送信するテキストチャンネルID
const serverid = process.env.SERVER_ID; //サーバーID
const waittime = process.env.WAIT_TIME; //いたずら防止のため最後に通知してから一定時間は通知しない(ミリ秒)
const leavemessage = toBoolean(process.env.LEAVE_MESSAGE); //退室時のメッセージ通知(trueだとオン)
const welcomemessage = toBoolean(process.env.WELCOME_MESSAGE); //新規メンバー通知(trueだとオン)

//botの準備ができた際
bot.on("ready", () => {
  console.log("Ready!");
  guild = bot.guilds.get(serverid);
  members = guild.members.filter(function(value) {
    return !value.bot;
  });

  json = JSON.stringify(members);
  json = JSON.parse(json);
  for (let i = 0; i < json.length; i++) {
    json[i].cooldown = false;
  }
});

//新規メンバーを含めたリストの再取得とか
bot.on("guildMemberAdd", (guild, member) => {
  const textChannel = guild.channels.find(
    channel => channel.id === sendtextchannel
  );
  if (welcomemessage === true) {
    const msg = `<@!${member.id}> ようこそ！`;
    bot.createMessage(textChannel.id, msg);
  }
  console.log("新規メンバーが加わったため、リストの再取得を行います");
  guild = bot.guilds.get(serverid);
  members = guild.members.filter(function(value) {
    return !value.bot;
  });
  
  json = JSON.stringify(members);
  json = JSON.parse(json);
  for (let i = 0; i < json.length; i++) {
    json[i].cooldown = false;
  }
  console.log("リストの再取得が完了しました");
});

// 入室
bot.on("voiceChannelJoin", (member, newChannel) => {
  const textChannel = newChannel.guild.channels.find(
    channel => channel.id === sendtextchannel
  );
  const username = member.nick != null ? member.nick : member.username;
  const msg = `**${username}** が **${newChannel.name}** に入室しました`;
  //jsonからIDを検索してcooldownの値がfalseならメッセージ送信
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
  const username = member.nick != null ? member.nick : member.username;
  const msg = `**${username}** が **${oldChannel.name}** から退室しました`;
  //IDが一致するユーザーのcooldownをFalseにして、n分後Trueにする
  json.filter(function(item, index) {
    if (item.id === member.id && item.cooldown === false) {
      //leavemessageがtrueなら退室時のメッセージ通知
      if (leavemessage === true) {
        bot.createMessage(textChannel.id, msg); //メッセージ送信
      }

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
