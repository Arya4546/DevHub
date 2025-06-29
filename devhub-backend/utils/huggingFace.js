
const axios = require("axios");

exports.getHuggingFaceSuggestion = async function (prompt) {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
    {
      inputs: prompt,
      parameters: { max_new_tokens: 300 },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
    }
  );

  return response.data[0]?.generated_text || "No suggestion generated.";
};
