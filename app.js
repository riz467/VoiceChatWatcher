require("dotenv").config();
const Eris = require("eris");
const bot = new Eris(process.env.TOKEN);

//.envの値をbool型に変換する
function toBoolean(leavemessage) {
  return leavemessage.toLowerCase() === "true";
}

let guild, members, json;
let arr = [];

//.envファイルに記載
const sendtextchannel = process.env.SEND_TEXT_CHANNEL; //送信するテキストチャンネルID
const serverid = process.env.SERVER_ID; //サーバーID
const waittime = process.env.WAIT_TIME; //いたずら防止のため最後に通知してから一定時間は通知しない(ミリ秒)

//botの準備ができた際
bot.on("ready", () => {
  console.log("Ready!");
  guild = bot.guilds.get(serverid);
});

// 入室
bot.on("voiceChannelJoin", (member, newChannel) => {
  const textChannel = newChannel.guild.channels.find(
    (channel) => channel.id === sendtextchannel
  );
  const username = member.nick != null ? member.nick : member.username;
  const msg = `**${username}** が **${newChannel.name}** に入室しました`;
  if (arr.some(item => item == member.id)){
    return;
  }
  else{
    bot.createMessage(textChannel.id, msg);
  }
});

// 退室
bot.on("voiceChannelLeave", (member, oldChannel) => {
  if (arr.some(item => item == member.id)){
    return;
  }
  else{
    arr.push(member.id);
  }
  setTimeout(function () {
    let t = arr.indexOf(member.id);
    if (t >= 0) {
      arr.splice(t, 1);
    }
  }, waittime);
});

bot.connect();
