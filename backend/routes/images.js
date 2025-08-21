import express from 'express';
import OpenAI from 'openai';
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({ error: 'Brak promptu' });

  try {
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    res.json({ image: image.data[0].url });
  } catch (err) {
    if(err.status === 429){
      return res.json({ error: 'Limit 429', resetTime: err.headers['x-ratelimit-reset'] });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
