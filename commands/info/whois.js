const Discord = require('discord.js');

const noPerms = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You don't have the permissions to use this command!`);
const noUser = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No user specified`)
.setDescription(`Please mention a user to specify who you want to mute`);

module.exports = {
    name: 'whois',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.setDescription({embeds: [noPerms.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        if(!message.mentions.members.first()) return message.channel.send({embeds: [noUser.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        const embed = new Discord.MessageEmbed()
        .setColor(`BLUE`)
        .setAuthor(message.mentions.members.first().user.username, message.mentions.members.first().user.displayAvatarURL({dynamic: true}))
        .setTitle(`WhoIs ${message.mentions.members.first().user.username}`)
        .addField(`Username`, message.mentions.members.first().user.username, true)
        .addField(`User id`, message.mentions.members.first().id, true)
        .addField(`User tag`, message.mentions.members.first().user.tag, true)
        .addField(`Nickname`, message.mentions.members.first().nickname === null ? 'None' : message.mentions.members.first().user.nickname, false)
        .addField(`Roles`, message.mentions.members.first().roles.cache.size.toString(), true)
        .addField(`Bannable`, message.member.bannable === true ? 'Yes' : 'No', true)
        .addField(`Kickable`, message.member.kickable === true ? 'Yes' : 'No', true)
        .addField(`Joined at`, message.mentions.members.first().joinedAt.toString(), true)
        .addField(`Created at`, message.mentions.members.first().user.createdAt.toString(), true);

        message.channel.send({embeds: [embed]}).catch(err => {});
    }
};