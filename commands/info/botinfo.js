const Discord = require('discord.js');

module.exports = {
    name: 'botinfo',
    run: (client, message, args, config) => {
        const infoEmbed = new Discord.MessageEmbed()
        .setColor(`BLUE`)
        .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({dynamic: true}))
        .setTitle(`Info about me`)
        .setDescription(`My name is ${client.user.username} and my tag is ${client.user.tag}
My user id ${client.user.id}
I ${client.user.avatarURL({dynamic: true}) === null ? "don't " : ''} have an user avatar.
I was created at ${client.user.createdAt}`)
        .setThumbnail(client.user.displayAvatarURL({dynamic: true}));

        message.channel.send({embeds: [infoEmbed]}).catch(err => {});
    }
};