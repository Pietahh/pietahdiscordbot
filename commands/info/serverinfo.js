const Discord = require('discord.js');

module.exports = {
    name: 'serverinfo',
    run: async (client, message, args, config) => {
        await message.guild.invites.fetch();
        message.guild.fetchOwner().then(owner => {
            const serverInfo = new Discord.MessageEmbed()
            .setColor(`BLUE`)
            .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({dynamic: true}))
            .setTitle(`Server info`)
            .setDescription(`The name of this server is ${message.guild.name} and the id is ${message.guild.id}

    This server ${message.guild.bannerURL() === null ? "doesn't have" : 'has'} a banner

    The owner of the server is ${owner.user.username} and was created at ${message.guild.createdAt}

    The server has ${message.guild.invites.cache.size} invites
    The server has ${message.guild.memberCount} members

    The server has ${message.guild.roles.cache.size} roles, ${message.guild.channels.cache.filter(c => c.type === `GUILD_TEXT`).size} text channels and ${message.guild.channels.cache.filter(c => c.type === `GUILD_VOICE`).size} voice channels`);

            message.channel.send({embeds: [serverInfo]}).catch(err => {});
        }).catch(err => {});
    }
};