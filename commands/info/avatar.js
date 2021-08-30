const Discord = require('discord.js');

const noPerms = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You don't have the permissions to use this command!`);
const noUser = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No user specified`)
.setDescription(`Please mention a user to get their avatar`);

module.exports = {
    name: 'avatar',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({embeds: [noPerms.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        if(!message.mentions.members.first()) return message.channel.send({embeds: [noUser.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        const avatarEmbed = new Discord.MessageEmbed()
        .setColor(`BLUE`)
        .setAuthor(message.mentions.members.first().user.username, message.mentions.members.first().user.displayAvatarURL({dynamic: true}))
        .setTitle(`Avatar`)
        .setImage(message.mentions.members.first().user.displayAvatarURL({dynamic: true}));

        message.channel.send({embeds: [avatarEmbed]}).catch(err => {});
    }
};