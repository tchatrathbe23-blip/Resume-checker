import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI or dummy mode
const useDummy = !process.env.OPENAI_API_KEY || process.env.DUMMY === "true";
const openai = useDummy
  ? null
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

app.post("/analyze", async (req, res) => {
  const { resume } = req.body;

  if (!resume || resume.trim() === "") {
    return res.status(400).json({ result: "❗ Please paste a resume." });
  }

  if (useDummy) {
    return res.json({ result: "✅ Dummy Feedback: Resume looks good! Add more quantifiable achievements." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional resume reviewer." },
        { role: "user", content: `Please analyze this resume and suggest improvements:
${resume}` },
      ],
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI Error:", err.message);
    res.status(500).json({ result: "Failed to generate resume feedback.", error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Resume Analyzer backend running on port ${PORT}`);
});