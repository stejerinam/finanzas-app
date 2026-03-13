export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { merchants } = req.body;
  if (!merchants || !Array.isArray(merchants) || merchants.length === 0) {
    return res.status(400).json({ error: 'merchants array required' });
  }

  // API key lives here on the server — never sent to the browser
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `Categorize Mexican BBVA credit card merchant names. Use ONLY these category IDs: food, cafe, groceries, transport, health, subscriptions, shopping, education, rent, entertainment, fitness, travel, other.

Rules:
- OXXO / 7 ELEVEN / HEB / WALMART / COSTCO = groceries
- UBER RIDE / DIDI / CABIFY = transport
- UBER EATS / RAPPI / DIDI FOOD = food
- NETFLIX / SPOTIFY / GOOGLE / OPENAI / CHATGPT / CALENDLY / TELCEL / APPLE / AMAZON PRIME = subscriptions
- GYMPASS / SPORT CITY / GYM = fitness
- FARMACIA / FARM GUADALAJARA / SANBORNS FARM = health
- CAFE / COFFEE / CAFELIMON / CAFECACAO / KALI / LILACAFE / STARBUCKS = cafe
- REST / TACO / BURGER / GYRO / TEMAK / SUSHI / PIZZA / HELADO / PASTELERIA / NECTARJUICE / FRIDA / SALA DE DESPECHO / BPK = food
- INMOBILIARIA / RENTA = rent
- MACSTORE / APPLE STORE / BEST BUY = shopping
- AMAZON (non-Prime purchases) = shopping
- AEROBUS / AEROMEXICO / VOLARIS / VIVA = travel
- ORATORIO / UNIV / CONSULTOR / PAYCLIP / COLEGIO = education

Merchants to categorize:
${merchants.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Return ONLY a JSON object with no explanation, no markdown, no backticks:
{"MERCHANT_NAME": "categoryId", ...}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // fast + cheap for categorization
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic error:', data.error);
      return res.status(502).json({ error: data.error.message });
    }

    const raw = data.content?.[0]?.text || '{}';
    const categories = JSON.parse(raw.replace(/```json|```/g, '').trim());

    return res.status(200).json({ categories });
  } catch (err) {
    console.error('categorize error:', err);
    return res.status(500).json({ error: err.message });
  }
}
