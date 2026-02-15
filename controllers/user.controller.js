import { get } from "mongoose";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment/moment.js"; // for date and time
import { response } from "express";

// getting current user details
export const getCurrentUser = async (req, resp) => {
  try {
    const userId = req.userId; //decoded id by  isAuth
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }

    return resp.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};




export const updateAssistant = async (req, resp) => {
  try {
    const { assistantName, imageUrl } = req.body; // imgUrl is for prebuilt cards
    let assistantImage;

    // ✅ If a file was uploaded, send it to Cloudinary
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.buffer);
    } else {
      assistantImage = imageUrl; // for pre-built assistant images
    }

    const updatedData = {
  assistantName,
  assistantImage
};



    
    //  Correct mongoose method name
    // const user = await User.findByIdAndUpdate(
    //   req.userId,
    //   { assistantImage, assistantName },
    //   { new: true }
    // ).select("-password");

    const user = await User.findByIdAndUpdate(
  req.userId,
  updatedData,
  { new: true, runValidators: true } // runValidators important
).select("-password");

    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }

    return resp.status(200).json(user);
  } catch (error) {
    console.error("Update Assistant Error:", error);
    return resp
      .status(500)
      .json({ message: "Update assistant error", error: error.message });
  }
};

//gemini ask to assistant controller ================================================================================================


export const askToAssistant = async (req, resp) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return resp.status(404).json({ message: "User not found" });

    user.history.push(command);
    await user.save();

    const assistantName = user.assistantName;
    const userName = user.name;

    //  Get Gemini response (raw text)
    // const result = await geminiResponse(command, userName, assistantName);
    // console.log(" Gemini raw result:", result);
   let result;
    try {
      result = await geminiResponse(command, userName, assistantName);
    } catch (err) {
      console.error("🚫 Gemini API failed:", err.message);
      return resp.status(429).json({
        type: "limit",
        userInput: command,
        response: "AI limit reached. Please try again later."
      });
    }
//     try {
//   const data = await geminiResponse(transcript);
// } catch (err) {
//   if (err.response?.status === 429) {
//     speak("Too many requests. Please wait a moment.");
//   } else {
//     speak("Assistant failed to respond.");
//   }
// }


    if (!result) {
      return resp.status(429).json({
        type: "limit",
        userInput: command,
        response: "AI limit reached. Please try again later."
      });
    }





    //  Try to extract and parse JSON safely
    let gemResult;
    
    try {
      const jsonMatch = result.match(/{[\s\S]*}/);
      if (!jsonMatch) throw new Error("No JSON found");
      gemResult = JSON.parse(jsonMatch[0]);
      
    } catch (err) {
      
      console.error(" Failed to parse Gemini JSON:", err.message);
      return resp.json({
        type: "general",
        userInput: command,
        response: result,
      });
    }

    const { type, userInput, response: gemResponse } = gemResult;

    // 🕒 Handle time/date/day/month intents
    if (type === "get_date")
      return resp.json({
        type,
        userInput,
        response: `The current date is ${moment().format("YYYY-MM-DD")}`,
      });

    if (type === "get_time")
      return resp.json({
        type,
        userInput,
        response: `The current time is ${moment().format("hh:mm A")}`,
      });

    if (type === "get_day")
      return resp.json({
        type,
        userInput,
        response: `Today is ${moment().format("dddd")}`,
      });

    if (type === "get_month")
      return resp.json({
        type,
        userInput,
        response: `This month is ${moment().format("MMMM")}`,
      });

    // 🌐 Handle all other intents (YouTube, Instagram, etc.)
    if (
      [
        "google_search",
        "youtube_search",
        "youtube_play",
        "instagram_open",
        "facebook_open",
        "weather_show",
        "calendar_open",
        "general",
      ].includes(type)
    ) {
      return resp.json({
        type,
        userInput,
        response: gemResponse || "Done!",
      });
    }

    //  Default fallback
    return resp.status(400).json({
      response: "I didn't understand that command.",
    });
  } catch (error) {
    console.error(" askToAssistant error:", error);
    return resp.status(500).json({
      response: "ask assistant error",
      error: error.message,
    });
    
  }
};





// ======clear history
export const clearHistory = async (req, resp) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }

    user.history = []; //  clear history
    await user.save();

    return resp.status(200).json({
      success: true,
      message: "History cleared successfully",
    });
  } catch (error) {
    console.error("Clear history error:", error);
    return resp.status(500).json({
      message: "Failed to clear history",
      error: error.message,
    });
  }
};
