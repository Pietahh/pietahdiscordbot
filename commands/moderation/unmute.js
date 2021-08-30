const Discord = require('discord.js');

const noPerms = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You don't have the permissions to use this command!`);
const noUser = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No user specified`)
.setDescription(`Please mention a user to specify who you want to unmute`);
const noRole = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Role not found`)
.setDescription(`The specified role in the .env file couldn't be found!`);
const error = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Error`)
.setDescription(`There was an error while unmuting the user!`);
const unmuted = new Discord.MessageEmbed()
.setColor(`GREEN`)
.setTitle(`User unmuted`)
.setDescription(`The user got successfully unmuted!`);

module.exports = {
    name: 'unmute',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.setDescription({embeds: [noPerms.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        if(!message.mentions.members.first()) return message.channel.send({embeds: [noUser.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        const role = message.guild.roles.cache.get(config.muterole);
        if(!role) return message.channel.send({embeds: [noRole.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        message.mentions.members.first().roles.remove(role).then(() => {
            message.channel.send({embeds: [unmuted]});
        }).catch(err => {
            message.channel.send({embeds: [error]});
        });
    }
};