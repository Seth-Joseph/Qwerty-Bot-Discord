require("dotenv").config();


const { Client, WebhookClient } = require('discord.js');
const Discord = require('discord.js')
const bot = new Discord.Client({disableEveryone: true});

const got = require('got');
const ms = require('ms');
const moment = require('moment');
const weather = require('weather-js');
const math = require('mathjs');
const fetch = require('node-fetch');
const os = require('os');
const { MessageEmbed } = require('discord.js')
const axios = require('axios');

const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});

const webhookClient = new WebhookClient(
 process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN,
);

const PREFIX = ";";

client.on("ready", () =>{
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(` you typing ${PREFIX}help`, {type: 'LISTENING'}) // PLAYING, WATCHING, LISTENING, STREAMING
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content === 'hello'){
    message.channel.send('hello');
  }
 

  //anti ad

 /* function is_url(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if(regexp.test(str)) {
      return true;
    } else {
      return false;
    }
    
  }   if(is_url(message.content) === true) {
    message.delete()
    let emb = new Discord.MessageEmbed()
      .setTitle("No Self-Promotion")
      .setDescription('You cant send those links here')
      .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/795221082562101278/no-wifi.png') 
      .setFooter("Qwerty")
      .setColor('#ff0000')
      .setTimestamp()
      
     return message.channel.send(emb);
  }*/
  
  //boost
 

  const { badwords } = require("./data.json") 
  if(!message.member.hasPermission("MANAGE_CHANNELS")) {
    
  }let confirm = false;
   
  var i;
  for(i = 0;i < badwords.length; i++) {
    
    if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
      confirm = true;
    
  }
  if(confirm) {
    message.delete()
    let emb = new Discord.MessageEmbed()
      .setTitle("No Bad-Words")
      .setDescription('You are not allowed to send badwords here')
      .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/795222731938725918/no-touch.png') 
      .setFooter("Qwerty")
      .setColor('#ff0000')
      .setTimestamp()
      
     return message.channel.send(emb);
      }   

  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .toLowerCase()
      .substring(PREFIX.length)
      .split(/\s+/);
   if(CMD_NAME === 'kick'){
   
      const { member, mentions } = message
  
      const tag = `<@${member.id}>`
  
      if (
        member.hasPermission('ADMINISTRATOR') ||
        member.hasPermission('KICK_MEMBERS')
      ) {
        const target = mentions.users.first()
        if (target) {
          const targetMember = message.guild.members.cache.get(target.id)
          targetMember.kick()
          message.channel.send(`${tag}That user has been kicked `)
        } else {
          message.channel.send(`${tag} Please specify someone to kick.`)
        }
      } else {
        message.channel.send(
          `${tag} You do not have permission to use this command.`
        )
      }
    
  }else if(CMD_NAME === 'nickname'){
    // You can make a single array to detect the user permissions.
  if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
    return message.channel.send({embed: {color: "RED", description: "You can't use this command!"}})
  }
  
  let user = message.mentions.users.first(); // You can mention someone, not only just user.
  if (!user) return message.channel.send({embed: {color: "RED", description: "You need to mention the user!"}});
  
  let nick = args.slice(1).join(" ");
  if (!nick) return message.channel.send({embed: {color: "RED", description: "You need to input the nickname!"}});
  
  let member = message.guild.members.cache.get(user.id);
  
  await member.setNickname(nick).catch(err => message.channel.send({embed: {color: "RED", description: `Error: ${err}`}}));
  let emb = new Discord.MessageEmbed()
    .setDescription(`Successfully changed **${user.tag}** nickname to **${nick}**`)
    .setColor('GREEN')
    .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/800388162740420639/2766966.png')
  return message.channel.send(emb);

  }else if(CMD_NAME === 'avatar'){
    let user;
  
  if (message.mentions.users.first()) {
    user = message.mentions.users.first();
  } else if (args[0]) {
    user = message.guild.members.cache.get(args[0]).user;
  } else {
    user = message.author;
  }
  
  let avatar = user.displayAvatarURL({size: 4096, dynamic: true});
  // 4096 is the new biggest size of the avatar.
  // Enabling the dynamic, when the user avatar was animated/GIF, it will result as a GIF format.
  // If it's not animated, it will result as a normal image format.
  
  const embed = new Discord.MessageEmbed()
  .setTitle(`${user.tag} Avatar`)
  .setDescription(`[Avatar URL of **${user.tag}**](${avatar})`)
  .setColor('GREEN')
  .setImage(avatar)
  
  
  return message.channel.send(embed);

  }
  
  else if(CMD_NAME === 'serverinfo'){
    let region;
        switch (message.guild.region) {
            case "europe":
                region = '<:europeanunion:800940924746203168> Europe';
                break;
            case "us-east":
                region = '<:unitedstatesofamerica:800940924350758983> us-east'
                break;
            case "us-west":
                region = '<:unitedstatesofamerica:800940924350758983> us-west';
                break;
            case "us-south":
                region = '<:unitedstatesofamerica:800940924350758983> us-south'
                break;
            case "us-central":
                region = '<:unitedstatesofamerica:800940924350758983> us-central'
                break;
            case "india":
                region = '<:india:800940925194469406> India'
                break;
            case "hongkong":
                region = '<:hongkong:800944783971319838> Hong Kong'
                break;
            case "brazil":
                region = '<:brazil:800944784625369119> Brazil'
                break;
            case "russia":
                region = '<:russia:800944784575037450> Russia'
                break;
            case "singapore":
                    region = '<:singapore:800944783933440041> Singapore'
                          break;
                          case "japan":
                            region = '<:japan0000:800944785132486676> Japan'
                            break;
                          }

        const embed = new MessageEmbed()
            .setThumbnail(message.guild.iconURL({dynamic : true}))
            .setColor('GREEN')
            .setFooter('Qwerty')
            .setTimestamp()
            .setTitle(`${message.guild.name} Server Stats`)
            .addFields(
                {
                    name: "👑 Owner: ",
                    value: `\`${message.guild.owner.user.tag}\``,
                    inline: true
                },
                {
                    name: "<:user:795534618060652544> Members: ",
                    value: `\`There are ${message.guild.memberCount} users!\``,
                    inline: true
                },
                {
                    name: "🟢 Members Online: ",
                    value: `\`There are ${message.guild.members.cache.filter(m => m.user.presence.status == "online").size} users online!\``,
                    inline: true
                },
                {
                    name: "🤖 Total Bots: ",
                    value: `\`There are ${message.guild.members.cache.filter(m => m.user.bot).size} bots!\``,
                    inline: true
                },
                {
                    name: "<:calendar:795534616643108895> Creation Date: ",
                    value: `\`${message.guild.createdAt.toLocaleDateString("en-us")}\``,
                    inline: true
                },
                {
                    name: "<:countdown:800939499181572097> Roles Count: ",
                    value: `\`There are ${message.guild.roles.cache.size} roles in this server.\``,
                    inline: true,
                },
                {
                    name: `🗺 Region: `,
                    value: region,
                    inline: true
                },
                {
                    name: `<:656752:795542594033549362> Verified: `,
                    value: message.guild.verified ? `\`Server is verified\`` : `\`Server is not verified\``,
                    inline: true
                },
                {
                    name: '<:3656_NitroBoost:800940002870951946> Boosters: ',
                    value: message.guild.premiumSubscriptionCount >= 1 ? `\`There are ${message.guild.premiumSubscriptionCount} Boosters\`` : `\`There are no boosters\``,
                    inline: true
                },
                {
                    name: "😀Emojis: ",
                    value: message.guild.emojis.cache.size >= 1 ? `\`There are ${message.guild.emojis.cache.size} custom emojis!\`` : `\`There is no custom emojis\`` ,
                    inline: true
                }
                
            )
        await message.channel.send(embed)
    }
  
  
  
  
  
  
  
  
  
  
  
  else if(CMD_NAME === 'slo'){
    if (!message.member.permissions.any(["ADMINISTRATOR", "MANAGE_CHANNELS"])) {
      return message.channel.send("Oopsie, you don't have any rights to do this.");
    }
    
    let channel = message.mentions.channels.first(),
        time = args.slice(1).join(" ");
    
    if (!channel) time = args.join(" "), channel = message.channel;
    // If the user doesn't includes the channel.
    
    if (message.flags[0] === "off") {
      channel.setRateLimitPerUser(0);
      return message.channel.send(`<#${channel.id}> slowmode has been deactivated.`);
    }
    
    if (!time) return message.channel.send("Please includes the time format.");
    
    let convert = ms(time); // This will results the milliseconds.
    let toSecond = Math.floor(convert / 1000); // This will convert the ms to s. (seconds)
    
    if (!toSecond || toSecond == undefined) return message.channel.send("Please insert the valid time format!");
    
    if (toSecond > 21600) return message.channel.send("Timer should be less than or equal to 6 hours.");
    else if (toSecond < 1) return message.channel.send("Timer should be more than or equal to 1 second.");
    
    await channel.setRateLimitPerUser(toSecond);
    let emb = new Discord.MessageEmbed()
    .setDescription(`The channel: <#${channel.id}> has been slowing down for **${ms(ms(time), {long: true})}**.`)
    .setColor('GREEN')
  return message.channel.send(emb);
    
  }
   else if (CMD_NAME === 'ban') {
    
      const { member, mentions } = message
  
      const tag = `<@${member.id}>`
  
      if (
        member.hasPermission('ADMINISTRATOR') ||
        member.hasPermission('BAN_MEMBERS')
      ) {
        const target = mentions.users.first()
        if (target) {
          const targetMember = message.guild.members.cache.get(target.id)
          targetMember.ban()
          message.channel.send(`${tag} That user has been banned`)
        } else {
          message.channel.send(`${tag} Please specify someone to ban.`)
        }
      } else {
        message.channel.send(
          `${tag} You do not have permission to use this command.`
        )
      }
 }else if (CMD_NAME === 'status'){
  
  const content = message.content.replace('.status','')
  message.channel.send('Status changed ');
  client.user.setPresence({
    activity: {
      name: content,
      type: 'COMPETING',
    },
    
  })
}
else if(CMD_NAME === 'delete'){
  const messageArray = message.content.split(' ');
	const args = messageArray.slice(1);

    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Lack of Perms!');
    
    let deleteAmount;

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.reply('Please put a number only!') }

    if (parseInt(args[0]) > 101) {
        return message.reply('You can only delete 100 messages at a time!')
    } else {
        deleteAmount = parseInt(args[0]);
    }
 
    message.channel.bulkDelete(deleteAmount , true);
    let emb = new Discord.MessageEmbed()
    .setTitle(`**Successfully** Deleted ***${deleteAmount}*** Messages.`)
    .setColor('#ff0000')
    .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/795242596662247434/3177433.png')
    .setFooter('Qwerty')
    
    ;(await message.channel.send(emb)).react('✅');

  }else if(CMD_NAME === 'help'){
      let emb = new Discord.MessageEmbed()
      .setTitle("Qwerty Command List :")
      .setTimestamp()
      .setColor('RANDOM')
      .setImage('https://www.animatedimages.org/data/media/562/animated-line-image-0387.gif')
      .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/794942553043501106/3273857.png')
      .setFooter("Qwerty")
      .addFields(
        {
            name: "😀 Fun: ",
            value: `\`;fun\``,
            inline: true
        },
        {
          name: "🛠️ Moderation: ",
          value: `\`;mod\``,
          inline: true
      },
      {
        name: "<:info:795534616483463178> Informational: ",
        value: `\`;info\``,
        inline: true
    },
    {
      name: "🐶 Animals: ",
      value: `\`;animals\``,
      inline: true
  }
        
        
    )
      
      message.channel.send(emb);
}else if(CMD_NAME === 'mod'){
  if(message.member.permissions.has('ADMINISTRATOR')){
  let embedHelp = new Discord.MessageEmbed()
      .setTitle("These are my Moderation commands: ")
      .setDescription(`\`;kick,\``)
      .setDescription(`\`;ban,\``)
      .setDescription(`\`;delete,\``)
      .setDescription(`\`;status,\``)
      .setDescription(`\`;mute,\``)
      .setDescription(`\`;slowmode,\``)
      .setDescription(`\`;nickname,\``)
      .setDescription(`\`;kick,\``)
      .addField(';ban <{member.id}>','Bans the user')
      .addField(';delete <num>','Deletes recent messages')
      .addField(';status <text>',`Changes Qwerty's status`)
      .addField(';poll <{channelName}> <{Title}>','Starts a new poll')
      .addField(';mute <{member.id}> <{time}>','Temprory mute')
      .setTimestamp()
      .setColor('RANDOM')
      .setImage('https://www.animatedimages.org/data/media/562/animated-line-image-0387.gif')
      .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/794942553043501106/3273857.png')      .setFooter("Qwerty")
      
      message.channel.send(embedHelp);
  }

}else if(CMD_NAME === 'meme'){
  const embed = new Discord.MessageEmbed()
  got('https://www.reddit.com/r/memes/random/.json').then(response => {
      let content = JSON.parse(response.body);
      let permalink = content[0].data.children[0].data.permalink;
      let memeUrl = `https://reddit.com${permalink}`;
      let memeImage = content[0].data.children[0].data.url;
      let memeTitle = content[0].data.children[0].data.title;
      let memeUpvotes = content[0].data.children[0].data.ups;
      let memeDownvotes = content[0].data.children[0].data.downs;
      let memeNumComments = content[0].data.children[0].data.num_comments;
      embed.setTitle(`${memeTitle}`)
      embed.setURL(`${memeUrl}`)
      embed.setImage(memeImage)
      embed.setColor('#39FF14')
      embed.setFooter(`👍 ${memeUpvotes} | 👎 ${memeDownvotes} | 💬 ${memeNumComments}
      
      Qwerty`)
      message.channel.send(embed);
  })

}else if(CMD_NAME === 'mute'){
  
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
 
  
  if(message.member.hasPermission('MANAGE_MESSAGES')) {
      var member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
      if(!member) return message.reply('Please Provide a Member to TempMute.')

      let mainrole = message.guild.roles.cache.find(role => role.name === "Member");
      let role = message.guild.roles.cache.find(role => role.name === "Muted");

      if (!role) return message.reply("Couldn't find the 'muted' role.")

      let time = args[1];
      if (!time) {
          return message.reply("You didnt specify a time!");
      }

      member.roles.remove('789360785829658655')
      member.roles.add('789360836178083871');

      message.channel.send(`@${member.user.tag} has now been muted for ${ms(ms(time))}`)
      
      setTimeout( function () {
        member.roles.add(mainrole.id)
        member.roles.remove(role.id);
        message.channel.send(`@${member.user.tag} has been unmuted.`)
    }, ms(time));

} else {
    return message.channel.send('You dont have perms.')
}
      

  }else if(CMD_NAME === 'userinfo'){
    let userArray = message.content.split(" ");
    let userArgs = userArray.slice(1);
    let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;

    if (member.presence.status === 'dnd') member.presence.status = 'Do Not Disturb';
    if (member.presence.status === 'online') member.presence.status = 'Online';
    if (member.presence.status === 'idle') member.presence.status = 'Idle';
    if (member.presence.status === 'offline') member.presence.status = 'Offline';

    let x = Date.now() - member.createdAt;
    let y = Date.now() - message.guild.members.cache.get(member.id).joinedAt;
    const joined = Math.floor(y / 86400000);

    const joineddate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
    let status = member.presence.status;

    const userEmbed = new Discord.MessageEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setTimestamp()
    .setColor('#FF6700')
    .setImage(member.user.displayAvatarURL())
    .addField("Member ID", member.id)
    .addField('Roles', `<@&${member._roles.join('> <@&')}>`)
    .addField("Account Created On:", ` ${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY")}`, true) 
    .addField('Joined the server At', `${joineddate} \n> ${joined} day(S) Ago`)
    .addField("Status", status)
    .setFooter('Qwerty')

    message.channel.send(userEmbed);
}else if(CMD_NAME === 'poll'){
const messageArray = message.content.split(' ');
const argss = messageArray.slice(1);

let pollChannel = message.mentions.channels.first();
      let pollDescription = argss.slice(1).join(' ');

      let embedPoll = new Discord.MessageEmbed()
      .setTitle(pollDescription)
      .setColor('YELLOW')
      .setImage('https://www.animatedimages.org/data/media/562/animated-line-image-0387.gif')
      .setTimestamp()
      .setFooter('Qwerty')
      let msgEmbed = await pollChannel.send(embedPoll);
      await msgEmbed.react('👍')
      await msgEmbed.react('👎')

}else if(CMD_NAME === 'say'){
  const argsss = args;
  const sayMessage = argsss.join(" ")
message.delete().catch(err => console.log(err));
message.channel.send(sayMessage);
}else if(CMD_NAME === 'warn'){
  if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You can\'t use that!');

  var user = message.mentions.users.first();
  if(!user) return message.reply('You didn\'t mention anyone!');

  var member;

  try {
      member = await message.guild.members.fetch(user);
  } catch(err) {
      member = null;
  }

  if(!member) return message.reply('They aren\'t in the server!');

  var reason = args.splice(1).join(' ');
  if(!reason) return message.reply('You need to give a reason!');

  var channels = message.guild.channels.cache.find(c => c.name === 'testing');

  var emb = new Discord.MessageEmbed()
  .setTitle('User Warned')
  .addField('User:', user, true)
  .addField('By:', message.author, true)
  .addField('Reason:', reason)
  .setColor('#FF0000')
  .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/795198650963460157/3020000.png')
  message.channel.send(emb);

  var embeds = new Discord.MessageEmbed()
  .setTitle('You were warned!')
  .setDescription(reason);

  try {
      user.send(embeds);
  } catch(err) {
      console.warn(err);
  }

  message.channel.send(`**${user}** has been warned by **${message.author}**!`);

}else if(CMD_NAME === 'mutes'){
  
  if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You can\'t use that!');

  var user = message.mentions.users.first();
  if(!user) return message.reply('You didn\'t mention anyone!');

  var member;

  try {
      member = await message.guild.members.fetch(user);
  } catch(err) {
      member = null;
  }

  if(!member) return message.reply('They aren\'t in the server!');
  if(member.hasPermission('MANAGE_MESSAGES')) return message.reply('You cannot mute that person!');

  var rawTime = args[1];
  var time = ms(rawTime);
  if(!time) return message.reply('You didn\'t specify a time!');

  var reason = args.splice(2).join(' ');
  if(!reason) return message.reply('You need to give a reason!');

  var channel = message.guild.channels.cache.find(c => c.name === 'testing');

  var log = new Discord.MessageEmbed()
  .setTitle('User Muted')
  .addField('User:', user, true)
  .addField('By:', message.author, true)
  .addField('Expires:', rawTime)
  .addField('Reason:', reason)
  .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/795219938272870430/no-sound.png')
  message.channel.send(log);

  var embed = new Discord.MessageEmbed()
  .setTitle('You were muted!')
  .addField('Expires:', rawTime, true)
  .addField('Reason:', reason, true);

  try {
      user.send(embed);
  } catch(err) {
      console.warn(err);
  }

  var role = message.guild.roles.cache.find(r => r.name === 'Muted');

  member.roles.add(role);

  setTimeout(async() => {
      member.roles.remove(role);
  }, time);

  message.channel.send(`**${user}** has been muted by **${message.author}** for **${rawTime}**!`);
} else if(CMD_NAME === 'math'){
  if(!args[0]) return message.channel.send('Please provide a question');

      let resp;

      try {
          resp = math.evaluate(args.join(" "))
      } catch (e) {
          return message.channel.send('Please provide a **valid** question')
      }

      const embed = new Discord.MessageEmbed()
      .setTitle('__**Calculator**__')
      .addField('Question', `\`\`\`fix\n${args.join(' ')}\`\`\``)
      .addField('Answer', `\`\`\`apache\n${resp}\`\`\``)
      .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/794950274174681138/think2.png')
      .setFooter('Qwerty')
      .setColor('RANDOM')
      .setTimestamp()
      message.channel.send(embed);

}else if(CMD_NAME === 'covid'){
  let countries = args.join(" ");
      const noArgs = new Discord.MessageEmbed()
      .setTitle('Please enter a Country Name')
      .setColor('#FF0000')
      .setDescription(`Example : all or Name of Country`)
      .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/794967054561574922/stop.png')

      .setTimestamp()

      if(!args[0]) return message.channel.send(noArgs);

      if(args[0] === "all"){
          fetch(`https://covid19.mathdro.id/api`)
          .then(response => response.json())
          .then(data => {
              let confirmed = data.confirmed.value.toLocaleString()
              let recovered = data.recovered.value.toLocaleString()
              let deaths = data.deaths.value.toLocaleString()

              const embed = new Discord.MessageEmbed()
              .setTitle(`Worldwide COVID-19 Stats 🌎`)
              .addField('Confirmed Cases', `\`\`\`\n${confirmed}\`\`\``)
              .addField('Recovered', `\`\`\`\n${recovered}\`\`\``)
              .addField('Deaths', `\`\`\`\n${deaths}\`\`\``)
              .setColor('#39FF14')
              .setFooter('Qwerty')
              .setTimestamp()
              .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/794961788877799454/coronavirus.png')
              message.channel.send(embed)
          })
      }else {
          fetch(`https://covid19.mathdro.id/api/countries/${countries}`)
          .then(response => response.json())
          .then(data => {
              let confirmed = data.confirmed.value.toLocaleString()
              let recovered = data.recovered.value.toLocaleString()
              let deaths = data.deaths.value.toLocaleString()

              const embed = new Discord.MessageEmbed()
              .setTitle(`COVID-19 Stats for **${countries}**`)
              .addField('Confirmed Cases', `\`\`\`\n${confirmed}\`\`\``)
              .addField('Recovered', `\`\`\`\n${recovered}\`\`\``)
              .addField('Deaths', `\`\`\`\n${deaths}\`\`\``)
              .setColor('#39FF14')
              .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/794961788877799454/coronavirus.png')
              .setFooter('Qwerty')
              .setTimestamp()
              message.channel.send(embed)
          }).catch(e => {
            const embed = new Discord.MessageEmbed()
            .setTitle('Invalid country provided')
            .setDescription('Please provide valid a country name')
            .setColor('#FF0000')
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/789703126054600754/794967054561574922/stop.png')
              return message.channel.send(embed)
          })
   }
  } else if(CMD_NAME === 'ping'){
    const ping = new Discord.MessageEmbed()
        .setDescription(`\`${client.ws.ping}\`ms`)
        .setThumbnail('https://media.discordapp.net/attachments/789703126054600754/795315063144579122/ping.png?width=467&height=467')
        .setColor("RED")
        .setTimestamp()


        message.channel.send(ping);
  }else if(CMD_NAME === 'botinfo'){
    const embed = new MessageEmbed()
            .setThumbnail('https://cdn.discordapp.com/emojis/795534616438112296.png?v=1')
            .setTitle(`Bot Stats`)
            .setColor('#000000')
            .addFields(
                {
                    name: '<:server:795532897867005962> Servers',
                    value: `\`\`\`\n${client.guilds.cache.size}servers\`\`\``,
                    inline: true
                },
                {
                    name: '<:2249167:795534671089106965> Channels',
                    value: `\`\`\`\n${client.channels.cache.size} channels\`\`\``,
                    inline: true
                },
                {
                    name: `<:user:795534618060652544> Server Users`,
                    value: `\`\`\`\nServing ${client.users.cache.size}\`\`\``,
                    inline: true
                },
                {
                    name: '⏳ Ping',
                    value: `\`\`\`\n${Math.round(client.ws.ping)}ms\`\`\``,
                    inline: true
                },
                {
                    name: '<:calendar:795534616643108895> Join Date',
                    value:`\`\`\`\n${client.user.createdAt}\`\`\``,
                    inline: true
                },
                {
                    name: `<:info:795534616483463178> Server Info`,
                    value: `\`\`\`\nCores: ${os.cpus().length}\`\`\``,
                    inline: true
                }
            )
            .setColor('#00FFFF')
            .setFooter(`Created By: Unni Kuttan #4603`)

        await message.channel.send(embed)
    
  }if(CMD_NAME === 'snipe'){
    const msg = bot.snipes.fetch(message.channel.id)
  const embed = new Discord.MessageEmbed()
  .setAuthor(msg.author, msg.member.user.displayAvatarURL())
  .setDescription(msg.content)
  .setFooter('Get Sniped lol')
  .setTimestamp();
  message.channel.send(embed);
  }
  if(CMD_NAME === 'weather'){

    weather.find({search: args.join(" "), degreeType: 'C'}, function (error, result){
      if(error) return message.channel.send(error);
      if(!args[0]) return message.channel.send('Please specify a location')
  
      if(result === undefined || result.length === 0) return message.channel.send('**Invalid** location');
  
      var current = result[0].current;
      var location = result[0].location;
  
      const weatherinfo = new Discord.MessageEmbed()
      .setDescription(`\`\`\`\n${current.skytext}\`\`\``)
      .setTitle(`Weather forecast for ${current.observationpoint}`)
      .setThumbnail(current.imageUrl)
      .setColor("RANDOM")
      .addField('Timezone', `\`\`\`\nGMT + ${location.timezone}\`\`\``, true)
      .addField('Degree Type', `\`\`\`\nCelsius\`\`\``, true)
      .addField('Temperature', `\`\`\`\n${current.temperature}°\`\`\``, true)
      .addField('Wind',`\`\`\`\n${current.winddisplay}\`\`\``, true)
      .addField('Feels like', `\`\`\`\n${current.feelslike}°\`\`\``, true)
      .addField('Humidity', `\`\`\`\n${current.humidity}%\`\`\``, true)
      .setFooter('Qwerty')
      .setTimestamp()
  
  
      message.channel.send(weatherinfo)
      })      
  
    } 
    else if(CMD_NAME ==='ig'){
      if (!args[0]) {
        return message.channel.send(`Please Enter a Instagram Account Name`)
    }
    let url, response, account, details;
    try {
        url = `https://instagram.com/${args[0]}/?__a=1`;
        response = await axios.get(url)
        account = response.data
        details = account.graphql.user
    } catch (error) {
        return message.channel.send(`I cant find that account pls check the spelling`)
    }
  
    const embed = new MessageEmbed()
        .setTitle(`@${details.is_verified ? `${details.username} <:656752:795542594033549362>` : ` ${details.username}`} ${details.is_private ? '🔒' : ''} `)
        .setDescription(details.biography)
        .setThumbnail(details.profile_pic_url)
        .setColor('#fbad50')
        .setFooter('Qwerty')
        .addField(
            {
                name: "Total Posts:",
                value: `\`\`\`\n${details.edge_owner_to_timeline_media.count.toLocaleString()}\`\`\``,
                inline: true
            },
            {
                name: "Followers:",
                value: `\`\`\`\n${details.edge_followed_by.count.toLocaleString()}\`\`\``,
                inline: true
            },
            {
                name: "Following:",
                value: `\`\`\`\n${details.edge_follow.count.toLocaleString()}\`\`\``,
                inline: true
            }
        )
    await message.channel.send(embed)
    } 
  
  }
   }
  );
client.on('messageReactionAdd',(reaction,user)=>{

 
  console.log('role added')
  const {name} = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
 
                                //message id
  if (reaction.message.id === '789039812836720650') {
    switch (name) {
      case '🍎':
        member.roles.add('787590010235781131');//role id
        break ;
      case '🍌':
        member.roles.add('789038606081196032');//role id
        break ;
      case '🍇':
        member.roles.add('789038676885635072');//role id
        break ;
      case '🍑':
        member.roles.add('789039450218168330');//role id
        break ;
    }
  }

})


  
      
  





client.login(process.env.DISCORDJS_BOT_TOKEN)