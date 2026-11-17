exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Discord webhook is not configured" }) };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { student, answers } = data;
    if (!student || typeof student.name !== "string" || typeof student.email !== "string" ||
        typeof student.section !== "string" || !student.name.trim() || !student.email.trim() ||
        !student.section.trim() || !Array.isArray(answers) || answers.length !== 20 ||
        answers.some(a => !Number.isInteger(a) || a < 0 || a > 3)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid submission" }) };
    }
    if (student.name.length > 100 || student.email.length > 150 || student.section.length > 50) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Input too long" }) };
    }

    // Recalculate the score on the server; never trust the score sent by the browser.
    const correctAnswers = [1, 2, 0, 3, 2, 1, 0, 3, 1, 2, 0, 3, 1, 2, 0, 3, 1, 2, 0, 3];
    const score = answers.reduce((sum, answer, index) => sum + (answer === correctAnswers[index] ? 1 : 0), 0);
    const answerLines = answers.map((answer, index) =>
      `**Q${index + 1}:** ${["A", "B", "C", "D"][answer]}${answer === correctAnswers[index] ? " ✓" : " ✗"}`
    );

    const payload = {
      username: "CS4001NI Quiz",
      embeds: [{
        title: "Java Revision Quiz — New Submission",
        color: 5793266,
        fields: [
          { name: "Student name", value: student.name.trim(), inline: true },
          { name: "Email", value: student.email.trim(), inline: true },
          { name: "Section", value: student.section.trim(), inline: true },
          { name: "Score", value: `${score}/20 (${Math.round(score / 20 * 100)}%)`, inline: false },
          { name: "Answers", value: answerLines.join("\n"), inline: false }
        ],
        footer: { text: "CS4001NI · Java Revision Weeks 1 & 2" },
        timestamp: new Date().toISOString()
      }]
    };

    const discordResponse = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!discordResponse.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Discord rejected the submission" }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, score }) };
  } catch (error) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Could not process submission" }) };
  }
};
