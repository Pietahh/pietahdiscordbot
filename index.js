const Discord = require('discord.js');
const fs = require('fs');
const discordaudio = require('discordaudio');
const ytdl = require('ytdl-core');
require('dotenv').config();

const config = {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    muterole: process.env.MUTEROLE,
    botlogs: process.env.BOTLOGS,
    activity: process.env.ACTIVITY,
    ignorepermissions: ['unlock'],
    embedcolor: process.env.EMBEDCOLOR
}

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES]});

client.commands = new Map();

const queue = new Map();

client.once('ready', () => {
    const commanddir = fs.readdirSync('./commands');
    commanddir.forEach(dir => {
        const directionary = fs.readdirSync(`./commands/${dir}`);
        for(let filename of directionary){
            if(filename.toLowerCase().endsWith(".js")){
                const command = require(`./commands/${dir}/${filename}`);
                client.commands.set(command.name, command);
                console.log(`Command ${command.name} loaded`);
            } else {
                continue;
            }
        }
    });
    client.botlogs = client.channels.cache.get(config.botlogs);
    if(!client.botlogs) throw new Error(`The botlogs channel doesn't exists!`);
    client.user.setActivity(config.activity, {type: 'WATCHING'});
    console.log(`Bot started`);
});

client.on('messageCreate', async message => {
    if(message.author.bot || message.channel.type === `DM`) return;
    
    const channelPerms = message.channel.permissionsFor(message.guild.me);

    if(!message.content.toLowerCase().startsWith(config.prefix)) return;

    let args = message.content.substring(config.prefix.length).split(" ");

    if(!channelPerms.has(Discord.Permissions.FLAGS.SEND_MESSAGES) && !config.ignorepermissions.includes(args[0].toLowerCase())) return;

    const command = client.commands.get(args[0].toLowerCase());
    if(command) return command.run(client, message, args, config);
    else {
        const serverQueue = queue.get(message.guild.id);

        switch(args[0].toLowerCase()){
            case 'play':
                if(!args[1]) return message.channel.send({content: `Please provide a stream url`});
                if(!args[1].startsWith("https://") && !args[1].startsWith("http://")) return message.channel.send({content: `The provided stream url is not a valid url!`});
                const voicechannel = message.member.voice.channel;
                if(!voicechannel) return message.channel.send({content: `You need to join a voice channel before you can play a song`});
                const permissions = voicechannel.permissionsFor(message.guild.me);
                if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send({content: `I don't have the permissions to play something in this channel!`});
                const yturl = ytdl.validateURL(args[1]) ? true : false;
                if(!serverQueue){
                    const player = new discordaudio.Player(voicechannel);
                    const construct = {
                        voicechannel: voicechannel,
                        textchannel: message.channel,
                        songs: [{
                            url: args[1],
                            youtubeurl: yturl
                        }],
                        player: player,
                        loop: false
                    };
                    queue.set(message.guild.id, construct);
                    play(message.guild.id);
                } else {
                    serverQueue.songs.push({url: args[1], youtubeurl: yturl});
                    message.channel.send({content: `Your song has been added to the queue!`});
                }
                break;
            case 'skip':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to skip a song`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                serverQueue.songs.shift();
                play(message.guild.id);
                message.channel.send({content: `Song skipped!`});
                break;
            case 'loop':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to enable/disable the loop`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                serverQueue.loop = serverQueue.loop === true ? false : true;
                message.channel.send({content: `Loop is now **${serverQueue.loop === true ? 'enabled' : 'disabled'}**!`});
                break;
            case 'stop':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to stop a song`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                serverQueue.player.destroy();
                queue.delete(message.guild.id);
                message.channel.send({content: `Successfully stopped the player!`});
                break;
            case 'queue':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to see the queue`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                var songs = `__**Queue**__`;
                let tot = 1;
                serverQueue.songs.forEach(song => {songs += `\n**[${tot}]** ${song.url}`; ++tot;});
                const queueEmbed = new Discord.MessageEmbed()
                .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({dynamic: true}))
                .setColor(config.embedcolor)
                .setTitle(`Queue`)
                .setDescription(songs);
                message.channel.send({embeds: [queueEmbed]}).catch(err => {});
                break;
            case 'pause':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to pause a song`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                serverQueue.player.pause();
                message.channel.send({content: `Music got paused`});
                break;
            case 'resume':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to resume a song`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                serverQueue.player.resume();
                message.channel.send({content: `Music is playing again`});
                break;
            case 'volume':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to change the volume of a song`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                if(!args[1]) return message.channel.send({content: `Please provide the volume in the second argument of the command`});
                if(!isNaN(Number(args[1]))){
                    if(Number(args[1]) > 10 || Number(args[1]) < 1) message.channel.send({content: `The volume must be between the number 1-10`});
                    else {
                        serverQueue.player.volume(Number(args[1]));
                        message.channel.send({content: `The volume has been changed`});
                    }
                } else if(!args[1].includes("/")) return message.channel.send({content: `Invalid volume`});
                else {
                    let volume = args[1].split("/");
                    if(isNaN(Number(volume[0])) || isNaN(Number(args[1]))) return message.channel.send({content: `Invalid volume`});
                    if(Number(volume[0]) > Number(volume[1])) return message.channel.send({content: `Invalid volume`});
                    serverQueue.player.volume(`${volume[0]}/${volume[1]}`);
                    message.channel.send({content: `The volume has been changed`});
                }
                break;
            case 'reconnect':
                if(!message.member.voice.channel) return message.channel.send({content: `You have to be in a voice channel to change the volume of a song`});
                if(!serverQueue) return message.channel.send({content: `There is nothing in the queue at the moment`});
                serverQueue.player.reconnect(2500);
                message.channel.send({content: `Reconnected :thumbsup:`});
                break;
        }
    }
});

function play(guildId){
    const serverQueue = queue.get(guildId);
    serverQueue.player.on('stop', () => {
        if(serverQueue.loop === false) serverQueue.songs.shift();
        if(serverQueue.songs[0]) serverQueue.player.play(serverQueue.songs[0].url, {
            quality: 'high',
            autoleave: false
        }).catch(err => {
            serverQueue.textchannel.send({content: `There was an error while connecting to the voice channel`});
            console.log(err);
        });
        else {
            serverQueue.player.disconnect();
            queue.delete(guildId);
        }
    });
    serverQueue.player.on('play', () => {
        var embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true}))
        .setColor(config.embedcolor)
        .setTitle(`Playing a new song`)
        .setDescription(`I am now playing [${serverQueue.songs[0].url}](${serverQueue.songs[0].url})`);
        if(serverQueue.songs[0].youtubeurl === true){
            ytdl.getInfo(serverQueue.songs[0].url).then(info => {
                embed = new Discord.MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true}))
                .setColor(config.embedcolor)
                .setTitle(`Playing ${info.videoDetails.title}`)
                .setDescription(`I am now playing **[${info.videoDetails.title}](${serverQueue.songs[0].url})** by **${info.videoDetails.author.name}**`)
                .setThumbnail(info.videoDetails.thumbnails[0].url);
                serverQueue.textchannel.send({embeds: [embed]});
            }).catch(err => {
                serverQueue.textchannel.send({embeds: [embed]});
                console.log(err);
            });
        } else serverQueue.textchannel.send({embeds: [embed]});
    });
    if(!serverQueue.songs[0]){
        serverQueue.player.destroy();
        queue.delete(guildId);
        return undefined;
    }
    serverQueue.player.play(serverQueue.songs[0].url, {
        quality: 'high',
        autoleave: false
    }).catch(err => {
        console.log(err);
        serverQueue.textchannel.send({content: `There was an error while connecting to the voice channel`});
    });
}

client.on('guildBanAdd', (user, guild) => {
    const banEmbed = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setAuthor(user.user.username, user.user.displayAvatarURL({dynamic: true}))
    .setTitle(`User banned`)
    .setDescription(`The user ${user.user.username} has been banned!`);
    client.botlogs.send({embeds: [banEmbed]}).catch(err => {});
});

client.on('guildMemberRemove', member => {
    const leftEmbed = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true}))
    .setTitle(`User left`)
    .setDescription(`The user ${member.user.username} has left ${member.guild.name}`);
    client.botlogs.send({embeds: [leftEmbed]}).catch(err => {});
});

client.on('messageDelete', message => {
    const deletedEmbed = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({dynamic: true}))
    .setTitle(`Message deleted`)
    .setDescription("Message content: ```"+message.content+"```");
    client.botlogs.send({embeds: [deletedEmbed]}).catch(err => {});
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    const editedEmbed = new Discord.MessageEmbed()
    .setColor(`BLUE`)
    .setAuthor(oldMessage.member.user.username, oldMessage.member.user.displayAvatarURL({dynamic: true}))
    .setTitle(`Message edited`)
    .setDescription("Old message: ```"+oldMessage.content+"``` New message: ```"+newMessage.content+"```");
    client.botlogs.send({embeds: [editedEmbed]}).catch(err => {});
});

client.on('channelCreate', channel => {
    if(channel.type === `DM`) return;
    const channelEmbed = new Discord.MessageEmbed()
    .setColor(`GREEN`)
    .setTitle(`Channel created`)
    .setDescription(`A new channel named **${channel.name}** has been created! <#${channel.id}>`);
    client.botlogs.send({embeds: [channelEmbed]}).catch(err => {});
});

client.on('channelDelete', channel => {
    if(channel.type === `DM`) return;
    const channelEmbed = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setTitle(`Channel deleted`)
    .setDescription(`A channel named **${channel.name}** has been deleted!`);
    client.botlogs.send({embeds: [channelEmbed]}).catch(err => {});
});

client.on('channelUpdate', (oldchannel, newchannel) => {
    if(oldchannel.type === `DM`) return;
    const channelEmbed = new Discord.MessageEmbed()
    .setColor(`BLUE`)
    .setTitle(`Channel edited`)
    .setDescription(`A channel named **${oldchannel.name}** has been edited! The channel is now named **${newchannel.name}**. <#${newchannel.id}>`);
    client.botlogs.send({embeds: [channelEmbed]}).catch(err => {});
});

client.on('roleCreate', role => {
    const roleEmbed = new Discord.MessageEmbed()
    .setColor(`GREEN`)
    .setTitle(`Role created`)
    .setDescription(`A role named **${role.name}** has been created!`);
    client.botlogs.send({embeds: [roleEmbed]}).catch(err => {});
});

client.on('roleDelete', role => {
    const roleEmbed = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setTitle(`Role deleted`)
    .setDescription(`A role named **${role.name}** has been deleted!`);
    client.botlogs.send({embeds: [roleEmbed]}).catch(err => {});
});

client.login(process.env.token);