const Discord = require('discord.js');

const noPerms = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You don't have the permissions to lock this channel!`);
const lockedChannel = new Discord.MessageEmbed()
.setColor(`GREEN`)
.setTitle(`Channel locked`)
.setDescription(`This channel has been locked by a moderator!`);

module.exports = {
    name: 'lock',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({embeds: [noPerms.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        message.channel.send({embeds: [lockedChannel]}).then(() => {
            message.channel.permissionOverwrites.create(message.guild.roles.everyone, {
                SEND_MESSAGES: false
            }).catch(err => {});
        }).catch(err => {});
    }
};