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




///////////yutube copy 
// import axios from "axios"
// const geminiResponse=async (command,assistantName,userName)=>{
// try {
//     const apiUrl=process.env.GEMINI_API_URL
//     const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. 
// You are not Google. You will now behave like a voice-enabled assistant.

// Your task is to understand the user's natural language input and respond with a JSON object like this:

// {
//   "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month"|"calculator-open" | "instagram-open" |"facebook-open" |"weather-show"
//   ,
//   "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,

//   "response": "<a short spoken response to read out loud to the user>"
// }

// Instructions:
// - "type": determine the intent of the user.
// - "userinput": original sentence the user spoke.
// - "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

// Type meanings:
// - "general": if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas short answer dena
// - "google-search": if user wants to search something on Google .
// - "youtube-search": if user wants to search something on YouTube.
// - "youtube-play": if user wants to directly play a video or song.
// - "calculator-open": if user wants to  open a calculator .
// - "instagram-open": if user wants to  open instagram .
// - "facebook-open": if user wants to open facebook.
// -"weather-show": if user wants to know weather
// - "get-time": if user asks for current time.
// - "get-date": if user asks for today's date.
// - "get-day": if user asks what day it is.
// - "get-month": if user asks for the current month.

// Important:
// - Use ${userName} agar koi puche tume kisne banaya 
// - Only respond with the JSON object, nothing else.
// now your userInput- ${command}
// `;

//     const result=await axios.post(apiUrl,{
//     "contents": [{
//     "parts":[{"text": prompt}]
//     }]
//     })
// return result.data.candidates[0].content.parts[0].text
// } catch (error) {
//     console.log(error)
// }
// }

// export default geminiResponse




// // its mine

// const geminiResponse = async (command, userName, assistantName) => {
//   try {
//     const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
//     const apiKey = process.env.GEMINI_API_KEY;
//     const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
//        You are not Google . you will now behave like a voice-enabled assistant .
//        Your task is to understand the user's natural language input and respond with json object like this :
//        {

//        "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show", 
       
//        "userInput": "<original user input>" {only remove your name from userinput if exists) and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,

//     "response": "<a short spoken response to read out loud to the user>"
// }

// Instructions:
//       "type": determine the intent of the user.

//      "userInput": original sentence the user spoke.

//     "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.
// Type meanings: 
// -"general": if it's a factual or informational question or agar koi aisa question puchhta hai jiska answer tumhe pata hai usko bhi general ki category me rakhna. or sare javab deeply de sakti ho. 
// -"google_search": if user wants to search something on Google 
// -"youtube_search": if user wants to search something on YouTube.
// -"youtube_play": if user wants to directly play a video or song.
// -"calculator_open" if user wants to open a calculator
// -"instagram_open" if user wants to open instagram
// -"facebook_open" if user wants to open facebook.
// -"weather_show": if user wants to know weather
// -"get_time": if user asks for current time.
// -"get_date": if user asks for today's date.
// -"get_day": if user asks what day it is.
// - "get_month": if user asks for the current month.

// Important:
// Use ${userName} agar koi puche tume kisne banaya
// Only respond with the JSON object, nothing else.

//  now your userInput ${command};
 
//  `;

//     if (!apiUrl || !apiKey) {
//       throw new Error("Missing GEMINI_API_URL or GEMINI_API_KEY in .env");
//     }

//     const response = await axios.post(
//       apiUrl,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: prompt }],
//           },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": apiKey,
//         },
//       }
//     );

//     // return response.data.candidates[0].content.parts[0].text;
//     const candidates = response?.data?.candidates;
// if (!candidates || !candidates[0]?.content?.parts?.length) {
//   throw new Error("Invalid Gemini API response");
// }

// console.log(" Raw Gemini result:", response.data);
// return candidates[0].content.parts[0].text;

//   } catch (error) {
//     console.error("Gemini API Error:", error?.response?.data || error.message);
//     throw error;
//   }



  
// };
// export default geminiResponse;








/////////////// gemini.js
// import axios from "axios";

// const geminiResponse = async (command, assistantName, userName) => {
//   try {
//     const apiUrl = process.env.GEMINI_API_URL;
//     const apiKey = process.env.GEMINI_API_KEY;

//     if (!apiKey) throw new Error("GEMINI_API_KEY missing");

//     const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
// You are not Google. You will now behave like a voice-enabled assistant.

// Respond ONLY in JSON:
// {
//   "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
//   "userInput": "<original user input>",
//   "response": "<short voice-friendly reply>"
// }

// Your userInput: ${command}`;

//     const result = await axios.post(
//       apiUrl,
//       {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": apiKey,
//         },
//         timeout: 15000,
//       }
//     );

//     const text = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     return text || "Assistant failed to respond";

//   } catch (error) {
//     console.error("Gemini API error:", error.message);
//     return "Assistant failed to respond";
//   }
// };

// export default geminiResponse;

