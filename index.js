const TelegramBot = require('node-telegram-bot-api');
const token = '6484300463:AAH-qjDrBqLXCpdg0lqSdQ4VoOyXwJPcslI'; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});


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
        return bot.sendPhoto(chatId, g.url);
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
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Replace with the model you intend to use; check OpenAI documentation for the latest models
        messages: [{ role: "system", content: prompt }],
      });
      console.log(response.choices);
      return response.choices[0].message.content
    } catch (error) {
      console.error(error);
      return 'Please try again.';
    }
}

async function generateImage(prompt){
    console.log("Prompt image: "+ prompt)
    try{
        const image = await openai.images.generate({ model: "dall-e-3", prompt: prompt });
        console.log(image.data);
        return image.data[0];
    } catch (error){
        return {revised_prompt:"Error creating image.",  url:"Please try again."}
    }
}