require('dotenv').config();

//console.log(process.env.DISCORDJS_BOT_TOKEN);
// get client_id from discord dev portal
// enter the client_id in this url to add to server
//https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot

// Client class imported from discord.js
const {Client, WebhookClient} = require('discord.js');

// client object
// extends event emitter
const client = new Client({
    partials:['MESSAGE','REACTION']
});

const PREFIX ="$";

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
)

client.on("ready", ()=>{
    console.log(`${client.user.username} has logged in`);
});

client.on("message",(message)=>{
    // ignores bot messages
    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        // first element is stored in CMD_NAME
        // args is an array that stores all the other elements
        const [CMD_NAME,...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/); // handles white spaces ex $cmd    e    e
        console.log(CMD_NAME);
        console.log(args);
        if(CMD_NAME === 'kick'){
            if(!message.member.hasPermission('KICK_MEMBERS'))
                return message.reply("You do not have permissions");
            if(args.length === 0)
                return message.reply('Please provide an ID');
            const member = message.guild.members.cache.get(args[0]);
            if(member){
                member
                    .kick()
                    .then((member) => message.channel.send(`${member} was kicked`))
                    .catch((err)=> message.channel.send('I can\'t kick that user'))
            }else{
                message.channel.send("That member was not found");
            }
        }
        else if(CMD_NAME === 'announce'){
            const message = args.join(" ");
            webhookClient.send(message);

        }
    }
    
    if(message.content === "hello"){
        //message.reply("hello there"); this tags the user
        message.channel.send(`hello there, ${message.author.username}`); // username as a string
    }

});

client.on('messageReactionAdd',(reaction,user)=>{
    console.log("hello");
    const {name} = reaction.emoji;
    const member =reaction.message.guild.members.cache.get(user.id);
    if(reaction.message.id === "748950878345756802"){
        switch(name){
            case '🍎':
                member.roles.add("748945758056743024");
                break;
            case '🍌':
                member.roles.add("748945786871611443");
                break;
            case '🍑':
                member.roles.add("748945813283012710");
                break;
        }

    }
});

client.on('messageReactionRemove',(reaction,user)=>{
    console.log("hello");
    const {name} = reaction.emoji;
    const member =reaction.message.guild.members.cache.get(user.id);
    if(reaction.message.id === "748950878345756802"){
        switch(name){
            case '🍎':
                member.roles.remove("748945758056743024");
                break;
            case '🍌':
                member.roles.remove("748945786871611443");
                break;
            case '🍑':
                member.roles.remove("748945813283012710");
                break;
        }

    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
