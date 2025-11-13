// File: api/sendToSlack.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = await req.json();
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const payload = {
      text: `🤖 *AutoCare Agent Message:*\n${message}`,
    };

    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!slackRes.ok) {
      const text = await slackRes.text();
      throw new Error(`Slack returned ${slackRes.status}: ${text}`);
    }

    return res.status(200).json({ success: true, message: "Sent to Slack!" });
  } catch (err) {
    console.error("Slack error:", err);
    return res.status(500).json({ error: err.message });
  }
}
