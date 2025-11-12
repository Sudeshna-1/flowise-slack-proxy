// api/sendToSlack.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { summary, history, customerId, channel } = req.body || {};
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({ error: "Missing SLACK_WEBHOOK_URL env var" });
    }

    const payload = {
      text: `📞 *New Customer Care Case*
*Customer ID:* ${customerId || "N/A"}
*Channel:* ${channel || "N/A"}

*Summary:*
${summary || "No summary provided"}

*Conversation History:*
${history || "No conversation history"}`
    };

    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await slackRes.text();

    if (!slackRes.ok) {
      return res.status(slackRes.status).json({ error: text });
    }

    return res.status(200).json({ success: true, slackResponse: text });
  } catch (err) {
    console.error("sendToSlack error:", err);
    return res.status(500).json({ error: err.message });
  }
}
