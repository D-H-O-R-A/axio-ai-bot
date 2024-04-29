const TelegramBot = require('node-telegram-bot-api');
const token = '6484300463:AAH-qjDrBqLXCpdg0lqSdQ4VoOyXwJPcslI'; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });
const fetch = require("node-fetch")


bot.on('message',async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.toLowerCase().includes("axioai") ? msg.text.toLowerCase().replaceAll("axioai","openai") : msg.text;

    if (messageText === '/start') {
      return bot.sendMessage(chatId, 'Welcome! What can I assist you with today?');
    }
    if(messageText === "/image"){
        return bot.sendMessage(chatId, "To create an image using AxioAi's AI image generation engine, use /image and then write the description of the image you want to generate. Ex: /image a beautiful view on the beach with the sunset")
    }
    if(messageText.includes("/image")){
        bot.sendMessage(chatId, "Generating image, please wait...")
        var g = await generateImage(messageText.replaceAll("/image",""))
        // Envia a imagem como um arquivo diretamente do buffer
        return bot.sendPhoto(chatId, g);
    }else{
        var g = await generateText(messageText);
        if(g.toLowerCase().includes("openai")){
            return bot.sendMessage(chatId,g.toLowerCase().replaceAll("openai", "AxioAi"))
        }else{
            return bot.sendMessage(chatId,g)
        }
    }
});

async function generateText(prompt) {
    console.log("Prompt: "+prompt)
    try {
      var response = await fetch(`https://us-central1-bracefaucet.cloudfunctions.net/generateText?input=${prompt}`)
      if (!response.ok) {
        return {revised_prompt:"Error creating image.",  url:"Please try again."}
      }
      response = await response.json(); // use .json()
      return response.data
    } catch (error) {
      console.error(error);
      return 'Please try again.';
    }
}

async function generateImage(prompt){
    console.log("Prompt image: "+ prompt)
    try{
      var response = await fetch(`https://us-central1-bracefaucet.cloudfunctions.net/generateImage?input=${prompt}`)
      if (!response.ok) {
        return {revised_prompt:"Error creating image.",  url:"Please try again."}
      }
      response = await response.json(); // use .json()
      return response.data
    } catch (error){
        return {revised_prompt:"Error creating image.",  url:"Please try again."}
    }
}