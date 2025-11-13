import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/send-to-slack", async (req, res) => {
  const { summary, history, message } = req.body;
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  const payload = {
    text: `📞 *AutoCare Vehicle Recall Assistance*\n\n*Message:* ${message || ""}\n\n*Summary:* ${summary || ""}\n\n*Conversation History:* ${history || ""}`,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ success: false, error: text });
    }

    return res.json({ success: true, message: "Sent to Slack!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Slack microservice running on port ${PORT}`));
