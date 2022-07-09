const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js');
const {bothResponse} = require('./controller')

require('dotenv').config()

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    if (msg.type === 'sticker') {
        await client.sendMessage(msg.from, 'No puedo ver stickers')
        return
    }

    if (msg.type !== 'chat') {
        return
    }

    const response = await bothResponse(msg.body)

    await client.sendMessage(msg.from, response.replyMessage)
});

client.initialize();
