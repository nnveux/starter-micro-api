const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

let redirectTo;
let useTxt;


function redirectToPhone(message) {
  const msg = `from ${message._data.notifyName} - [${message.from}]:\n${message.body}`;
  if (message.from !== redirectTo) client.sendMessage(redirectTo, msg);
  else {
    const to = message._data.quotedMsg?.body?.split('[')[1]?.split(']')[0];
    if (to) client.sendMessage(to, message.body);
  }
}

const client = new Client();
client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// Replying Messages
client.on("message", (message) => {
  if (redirectTo) redirectToPhone(message);
  if (useTxt) client.sendMessage(message.from, useTxt);
});

client.on("message_create", (message) => {
  if (message.from !== message.to) return;

  if (message.body.startsWith('!!!')) {
    useTxt = message.body.split('!!!')[1].trim();
  }
  if (message.body.startsWith('redirectTo')) {
    redirectTo = `${message.body.split('redirectTo')[1].trim()}@c.us`;
  }
});
