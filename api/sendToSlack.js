import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { summary, history, customerId, channel } = req.body;
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(400).json({ message: "Missing SLACK_WEBHOOK_URL" });
  }

  const payload = {
    text: `📞 *New Customer Care Case*\n*Customer ID:* ${customerId || "N/A"}\n*Channel:* ${channel || "#customer-care"}\n\n*Summary:*\n${summary}\n\n*Conversation History:*\n${history}`,
  };

  try {
    const slackResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await slackResponse.text();

    if (!slackResponse.ok) {
      return res.status(slackResponse.status).json({ error: text });
    }

    return res.status(200).json({ success: true, text });
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: error.message });
  }
}
