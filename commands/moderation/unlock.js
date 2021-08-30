const Discord = require('discord.js');

const noPerms = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You don't have the permissions to unlock this channel!`);
const unlockedChannel = new Discord.MessageEmbed()
.setColor(`GREEN`)
.setTitle(`Channel unlocked`)
.setDescription(`This channel has been unlocked by a moderator!`);

module.exports = {
    name: 'unlock',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({embeds: [noPerms.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        message.channel.permissionOverwrites.create(message.guild.roles.everyone, {
            SEND_MESSAGES: true
        }).then(() => {
            message.channel.send({embeds: [unlockedChannel]}).catch(err => {});
        }).catch(err => {});
    }
};