const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Multer: Görseli "uploads/" klasörüne geçici kaydetmek için
const upload = multer({ dest: 'uploads/' });

// OpenAI ayarları
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ana sayfa (test için)
app.get('/', (req, res) => {
  res.send('✅ Otofix Backend is running...');
});

// Fotoğraf analiz rotası
app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = path.join(__dirname, req.file.path);
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze the uploaded car part image. Identify the part and describe any possible issues or maintenance requirements. Be technical and accurate.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    // Geçici görseli sil
    fs.unlinkSync(imagePath);

    // Sonucu gönder
    res.json({
      result: response.choices[0].message.content
    });

  } catch (err) {
    console.error('Error analyzing image:', err.message);
    res.status(500).json({ error: 'Image analysis failed' });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
