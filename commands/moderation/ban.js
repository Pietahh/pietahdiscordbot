const Discord = require('discord.js');

const noPerms = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You don't have the permissions to ban someone!`);
const noTags = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No user specified`)
.setDescription(`There has no user been specified!`);
const banFail = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Unable to ban user`)
.setDescription(`I was unable to ban the user! Please check if I have the right permissions and if the user is bannable!`);

module.exports = {
    name: 'ban',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({embeds: [noPerms.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        if(!message.mentions.members.first()) return message.channel.send({embeds: [noTags.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        var reason = (args[2] ? args.slice(2).join(" ") : `No reason provided`);

        message.mentions.members.first().ban({reason: reason, days: 7}).then(() => {
            
            const userBanned = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`User banned`)
            .setDescription(`The user ${message.mentions.members.first().user.username} has successfully been banned for the following reason: **${reason}**`);
            message.channel.send({embeds: [userBanned]});
        }).catch(err => {
            message.channel.send({embeds: [banFail.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        });
    }
};