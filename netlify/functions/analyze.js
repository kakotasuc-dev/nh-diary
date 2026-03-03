export async function handler(event) {
  try {
    const { diaryText } = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "あなたは子どもの成長を支援する優しい教育アドバイザーです。"
          },
          {
            role: "user",
            content: diaryText
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          result: "OpenAIエラー: " + JSON.stringify(data)
        })
      };
    }

    const aiMessage = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: aiMessage
      })
    };

  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        result: "サーバーエラー: " + error.message
      })
    };
  }
}
