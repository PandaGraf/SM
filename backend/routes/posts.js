import express from 'express';
import OpenAI from 'openai';
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { description } = req.body;
  if(!description) return res.status(400).json({ error: 'Brak opisu' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: 'Twórz posty idealnie dopasowane do platform: Facebook, Instagram, TikTok, LinkedIn. Dodawaj hashtagi i call-to-action.' },
        { role: 'user', content: description }
      ]
    });

    const posts = response.choices[0].message.content;
    res.json({ posts });
  } catch (err) {
    if(err.status === 429){
      return res.json({ error: 'Limit 429', resetTime: err.headers['x-ratelimit-reset'] });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
