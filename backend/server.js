const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("AI backend is running");
});

// AI route
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
  {
    role: "system",
    content: "You are a helpful personal AI assistant. Give short, clear answers in simple text without markdown symbols."
  },
  { role: "user", content: userMessage }
]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      content: response.data.choices[0].message.content
    });

  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);
    res.status(500).send("AI request failed");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});