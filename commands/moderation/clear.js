const Discord = require('discord.js');

const noPermissions = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`No permissions`)
.setDescription(`You have no permissions to clear messages`);
const maxEmbed = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Max clear`)
.setDescription(`I can max clear 99 messages per time`);
const missingParameter = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Missing parameter`)
.setDescription(`Please specify how many messages you want to clear`);
const nanEmbed = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Not a number`)
.setDescription(`The amount of messages that should be deleted is not a number!`);
const failBulk = new Discord.MessageEmbed()
.setColor(`RED`)
.setTitle(`Failed to clear`)
.setDescription(`I failed to delete the messages! Please make sure that I have the permission MANAGE_MESSAGES.`);

module.exports = {
    name: 'clear',
    run: (client, message, args, config) => {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({embeds: [noPermissions.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]})
        if(!args[1]) return message.channel.send({embeds: [missingParameter.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        if(isNaN(Number(args[1]))) return message.channel.send({embeds: [nanEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        const amount = Number(args[1]) + 1;

        if(amount > 100) return message.channel.send({embeds: [maxEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});

        message.channel.bulkDelete(amount).then(() => {
            const successEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Cleared messages`)
            .setDescription(`${args[1]} messages have successfully been cleared!`);

            message.channel.send({embeds: [successEmbed]});
        }).catch(err => {
            message.channel.send({embeds: [failBulk.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))]});
        });
    }
};