const Discord = require('discord.js');

const noPerms = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You don't have the permissions to kick someone!`);
const noTags = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No user specified`)
.setDescription(`There has no user been specified!`);
const kickFail = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Unable to kick user`)
.setDescription(`I was unable to kick the user! Please check if I have the right permissions and if the user is kickable!`);

module.exports = {
    name: 'kick',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({embeds: [noPerms.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        if(!message.mentions.members.first()) return message.channel.send({embeds: [noTags.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        var reason = (args[2] ? args.slice(2).join(" ") : `No reason provided`);

        message.mentions.members.first().kick(reason).then(() => {
            
            const userKicked = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`User kicked`)
            .setDescription(`The user ${message.mentions.members.first().user.username} has successfully been kicked for the following reason: **${reason}**`);
            message.channel.send({embeds: [userKicked]});
        }).catch(err => {
            message.channel.send({embeds: [kickFail.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        });
    }
};