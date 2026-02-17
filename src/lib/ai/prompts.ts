export const PROMPTS = {
  soWhat: (title: string, content: string) => `
You are a senior business analyst providing insights for CEOs.
Analyze this news article and provide a "So What?" analysis in Korean.

Title: ${title}
Content: ${content}

Respond in this exact JSON format:
{
  "keyPoint": "핵심 포인트 (1-2 sentences)",
  "background": "배경 설명 (1-2 sentences)",
  "outlook": "전망 (1-2 sentences)",
  "actionItem": "CEO를 위한 액션 아이템 (1-2 sentences)"
}

Respond ONLY with the JSON, no other text.`,

  briefSummary: (articles: string[]) => `
You are a news editor creating a morning brief for Korean CEOs.
From these articles, select the 5 most important ones and create a Korean summary.

Articles:
${articles.join('\n\n')}

For each selected article, provide:
1. Korean title
2. 2-sentence Korean summary explaining why this matters for business leaders

Respond in JSON format as an array of objects with fields: title, titleKo, summaryKo, impact (high/medium/low)`,

  translate: (text: string) => `
Translate the following text to Korean. Keep proper nouns and technical terms in their original form when appropriate.

Text: ${text}

Korean translation:`,

  summarize: (text: string) => `
Summarize the following news article in 3 sentences in Korean. Focus on the key facts and business implications.

Article: ${text}

Korean summary (3 sentences):`,

  weeklyReport: (industry: string, keywords: string[], articles: string[]) => `
You are a senior industry analyst writing a weekly report for Korean business leaders.
Industry: ${industry}
Related keywords: ${keywords.join(', ')}

Analyze these articles from this week and create a comprehensive weekly industry report in Korean.

Articles:
${articles.join('\n---\n')}

Respond in this exact JSON format:
{
  "headline": "이번 주 핵심 헤드라인 (1 sentence)",
  "topIssues": [
    {
      "title": "이슈 제목",
      "summary": "이슈 요약 (2-3 sentences)",
      "impact": "positive | negative | neutral"
    }
  ],
  "marketImpact": "시장 영향 분석 (2-3 sentences)",
  "outlook": "향후 전망 (2-3 sentences)",
  "upcomingEvents": ["다가오는 이벤트 1", "다가오는 이벤트 2", "다가오는 이벤트 3"]
}

Rules:
- topIssues should have exactly 3 items
- upcomingEvents should have 2-4 items
- All text must be in Korean
- impact must be one of: positive, negative, neutral
- Respond ONLY with the JSON, no other text.`,
};
