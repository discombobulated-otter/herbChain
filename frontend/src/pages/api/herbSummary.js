import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;


export default async function handler(req, res) {
  try {
    const { herbSpecies } = req.body;
    const herbName = herbSpecies.split("(")[0].trim();

    const prompt = `You are a knowledge retriever for medicinal plants. When provided with the name of a herb, return a concise structured medical summary using only standardized terminology. Do not provide unrelated information.

Herb: ${herbName}

**Output Format (JSON):**
{
  "HerbName": "<exact herb name>",
  "ScientificName": "<Latin binomial>",
  "Family": "<plant family>",
  "CommonUses": ["Primary therapeutic uses in traditional medicine", "Modern pharmacological uses (if verified)"],
  "ActiveConstituents": ["List of key bioactive compounds"],
  "PharmacologicalEffects": ["Observed/validated pharmacological actions"],
  "SafetyAndToxicity": "Brief safety profile (side effects, contraindications, toxicity if any)",
  "References": ["List of 2-3 reliable sources"]
}

Respond only with valid JSON.`;

    const completion = await groq.chat.completions.create({
      model: "",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    res.status(200).json(JSON.parse(responseText));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      HerbName: req.body.herbSpecies,
      ScientificName: "Information unavailable",
      Family: "Information unavailable",
      CommonUses: ["No reliable data available"],
      ActiveConstituents: ["No reliable data available"],
      PharmacologicalEffects: ["No reliable data available"],
      SafetyAndToxicity: "No reliable data available",
      References: ["Unable to fetch references"]
    });
  }
}
