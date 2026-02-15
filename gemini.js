// gemini.js
import axios from "axios";

const geminiResponse = async (command, userName, assistantName) => {
  try {
    // const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    const apiUrl= process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
       You are not Google . you will now behave like a voice-enabled assistant .
       Your task is to understand the user's natural language input and respond with json object like this :
       {

       "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show", 
       
       "userInput": "<original user input>" {only remove your name from userinput if exists) and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,

    "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
      "type": determine the intent of the user.

     "userInput": original sentence the user spoke.

    "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.
Type meanings: 
-"general": if it's a factual or informational question or agar koi aisa question puchhta hai jiska answer tumhe pata hai usko bhi general ki category me rakhna. or sare javab deeply de sakti ho. 
-"google_search": if user wants to search something on Google 
-"youtube_search": if user wants to search something on YouTube.
-"youtube_play": if user wants to directly play a video or song.
-"calculator_open" if user wants to open a calculator
-"instagram_open" if user wants to open instagram
-"facebook_open" if user wants to open facebook.
-"weather_show": if user wants to know weather
-"get_time": if user asks for current time.
-"get_date": if user asks for today's date.
-"get_day": if user asks what day it is.
- "get_month": if user asks for the current month.

Important:
Use ${userName} agar koi puche tume kisne banaya
Only respond with the JSON object, nothing else.

 now your userInput ${command};
 
 `;

    if (!apiUrl || !apiKey) {
      throw new Error("Missing GEMINI_API_URL or GEMINI_API_KEY in .env");
    }

    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
      }
    );

    // return response?.data?.candidates[0]?.content?.parts[0]?.text;
    const candidates = response?.data?.candidates;
if (!candidates || !candidates[0]?.content?.parts?.length) {
  throw new Error("Invalid Gemini API response");
}

console.log("🧠 Raw Gemini result:", response.data);

return candidates[0]?.content?.parts[0]?.text;
// const text =
//   response?.data?.candidates?.[0]?.content?.parts
//     ?.map(p => p.text)
//     .join("");

// if (!text) {
//   throw new Error("Gemini returned empty text");
// }

// return text;


  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    throw error;
  }
};
export default geminiResponse;



