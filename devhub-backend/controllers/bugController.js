const Bug = require("../models/Bug");
const axios = require("axios");


// ✅ Helper for Hugging Face
async function getHuggingFaceSuggestion(prompt) {
  
  const completionPrompt = `
### BUG REPORT

${prompt}

### AI SUGGESTION
`;

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
    {
      inputs: completionPrompt,
      parameters: { max_new_tokens: 300 },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
    }
  );

  console.log("Hugging Face raw:", response.data);

  // Remove prompt from output to get only AI suggestion
  return response.data[0]?.generated_text?.replace(completionPrompt, "").trim() || "No suggestion generated.";
}

exports.createBug = async (req, res) => {
  const { title, description, tags, project, privacy } = req.body;
  const userId = req.user.id;

  try {
    const bug = await Bug.create({
      user: userId,
      title,
      description,
      tags: JSON.parse(tags), // Because your frontend sends JSON in FormData
      project,
      privacy,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null, // 👈 Local file path
    });

    const populated = await bug.populate("user", "name");
    req.app.get("io").emit("new_bug", populated);

    res.status(201).json({ message: "Bug created", bug: populated });
  } catch (err) {
    console.error("Create Bug Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all bugs
exports.getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({ privacy: "public" })
      .populate("user", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(bugs);
  } catch (err) {
    console.error("Get Bugs Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Comment on a bug
exports.addComment = async (req, res) => {
  const bugId = req.params.id;
  const userId = req.user.id;
  const { text } = req.body;

  try {
    const bug = await Bug.findById(bugId);
    if (!bug) return res.status(404).json({ message: "Bug not found" });

    const comment = { user: userId, text };
    bug.comments.push(comment);
    await bug.save();

    const populatedComment = await bug.populate("comments.user", "name");

    req.app.get("io").emit("new_bug_comment", { bugId, comment });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("Add Comment Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ AI Suggestion for a bug
exports.aiSuggestion = async (req, res) => {
  const bugId = req.params.id;

  try {
    const bug = await Bug.findById(bugId);
    if (!bug) return res.status(404).json({ message: "Bug not found" });

    const prompt = `You are an expert developer.
A developer reports this bug:
Title: ${bug.title}
Description: ${bug.description}

Give a short, clear, step-by-step fix for this bug. Do not ask for more info.`;

    const suggestion = await getHuggingFaceSuggestion(prompt);

  bug.aiSuggestion = suggestion;
    await bug.save();

    res.status(200).json({ suggestion });
  } catch (err) {
    console.error("AI Suggestion Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};