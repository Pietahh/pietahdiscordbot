const Discord = require('discord.js');

module.exports = {
    name: 'help',
    run: (client, message, args, config) => {
        const helpEmbed = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({dynamic: true}))
        .setTitle(`Help embed`)
        .setDescription(`**Moderation commands:**
${config.prefix}ban - Ban a user from the server
${config.prefix}kick - Kick a user from the server
${config.prefix}clear - Clear an amount of messages
${config.prefix}lock - Lock a channel
${config.prefix}unlock - Unlock a channel
${config.prefix}mute - Mute a person
${config.prefix}unmute - Unmute a person

**Info commands:**
${config.prefix}avatar - Get a user's avatar
${config.prefix}botinfo - Get info about the bot
${config.prefix}serverinfo - Get info about the server
${config.prefix}whois - Get info about an user`);
        message.channel.send({embeds: [helpEmbed]}).catch(err => {});
    }
};