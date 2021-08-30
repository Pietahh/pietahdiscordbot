# Extive Medium Discord bot
![Extive Logo](https://www.extive.eu/assets/img/extive.png)

> **Hint** If you're using Visual Studio Code, press ctrl+shift+v

This bot was written as a reward for users to be active in the [Extive Discord server](https://www.extive.eu/discord). In this readme file you will find out how to setup this pre-made bot.

## Steps before setting up your bot
1. Go to the [Discord developer portal](https://www.discord.com/developers)
2. Create an application by clicking the 'New Application' button at the top
3. Give your application a name
4. When you've created the application, go to it and click in the sub menu on 'Bot'
5. Click on the button 'Add Bot' and confirm that you want to create a bot by clicking next on the 'Yes, do it!' button.
6. You'll see a new screen. Change the following things
    - Switch the 'Presence Intent' toggler to true in the 'Privileged Gateway Intents'
    - Switch the 'Server Members Intent' toggler to true in the 'Privileged Gateway Intents'
    - Switch the 'Public Bot' toggler to false at the top

## Setting up your bot
- Inserting your token
    1. Go to the [Discord developer portal](https://www.discord.com/developers) and select your application
    2. Go to 'Bot' in the sub menu
    3. Click on the 'Copy' button which you'll see underneath your bot's username.
    4. Go to the ['.env' file](./.env) in these files
    5. Replace 'YOUR-BOT-TOKEN' at 'TOKEN' with your token that you have in your clipboard
- Setting your prefix
    1. Go to the ['.env' file](./.env) in these files
    2. Replace the '.' at 'PREFIX' with the prefix what you want to use
- Setting up your mute command
    1. Go to [Discord](https://discord.com/app).
    2. Go to your user settings
    3. Click on 'advanced'
    4. Enable 'Developer Mode'
    5. Go to the server where you want to put your bot in
    6. Go to the roles of that server by clicking 'Server Settings' -> 'Roles'
    7. Right click the mute role and click 'Copy ID'
    8. Go to the ['.env' file](./.env) and replace 'YOUR-MUTE-ROLE-ID' at 'MUTEROLE' with the id of your role by pasting the ID
- Setting up your bot logs channel
    1. Go to [Discord](https://discord.com/app).
    2. Go to your user settings
    3. Click on 'advanced'
    4. Enable 'Developer Mode'
    5. Go to the server where you want to put your bot in
    6. Go to the channel where you want the bot logs messages in
    7. Right click the channel and click 'Copy ID'
    8. Go to the ['.env' file](./.env) and replace 'YOUR-BOT-LOGS-CHANNEL-ID' at 'BOTLOGS' with the id of your role by pasting the ID
- Setting up your bot's status
    1. Go to the ['.env' file](./.env) and replace 'YOU!' at 'ACTIVITY' with the status which you want.
- Setting up the music embed colors
    1. Go to the ['.env' file](./.env) and replace '#32e358' at 'EMBEDCOLOR' with the HEX color code which you want

## Hosting your bot
### Local
1. Go to the [NodeJS website](https://nodejs.org)
2. Download the current version (16.6.1 or higher)
3. After installing open your Command Prompt
    - Windows: Press the Windows key and type 'cmd'. There will be a result called 'Command Prompt', open that application.
    - Mac: Press Command + Space and type "Terminal" and double click the search result.
4. Go to the location of your bot files by typing "cd "+ your file location
5. Type "npm i discord.js fs dotenv" and hit enter.
6. After the installation is done you can type "node ." and it will start up your bot.

### Hosting
1. Upload your files to your host
2. Make sure to select the NodeJS version 16 (Mostly you can select it by going to 'Settings'->'Docker Image'->'NodeJS version 16')
3. Make sure that the following packages are installed
    - Discord.js
    - fs
    - dotenv
4. If they're installed you can press the 'start' button

## Local or Hosting?
It's mostly recommended to use an hosting. An hosting will make sure that your bot will always be online. If you're hosting your bot local, it will only be online when you are online on your pc/laptop. Some cheap hostings are:
- [replit](https://replit.com) - Free (not the most recommended as they don't provide NodeJS version 16 what is required for this bot to work. There is another way how to use NodeJS version 16 at replit, see "Use NodeJS v16 at replit")
- [MC-Node](https://mc-node.net) - Free (not always in stock and is a Dutch hosting)
- [Hostcheap](https://hostcheap.nl) - Free (Is a Dutch hosting)
- [CubesHost](https://cubes.host) - Is a cheap hosting

**Don't forget to save your changes!**

## Use NodeJS v16 at replit
- Install the latest version of the package node
- Go to the 'Shell'
- Run 'npx node index.js'