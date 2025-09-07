const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const app = express();
const port = 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyANEObu86QiRhhuoFwdeQfAYkIcuGkEp6g");

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/tryon', upload.fields([{ name: 'person' }, { name: 'cloth' }]), async (req, res) => {
  try {
    if (!req.files?.person || !req.files?.cloth) {
      return res.status(400).json({ error: 'Please upload both person and cloth images.' });
    }

    // Convert uploaded files to base64
    const personImageBase64 = fs.readFileSync(req.files.person[0].path).toString('base64');
    const clothImageBase64 = fs.readFileSync(req.files.cloth[0].path).toString('base64');

    const prompt = `
      You are given two images:
      1. A person
      2. A clothing item
      Generate a realistic image of the person wearing the clothing, ensuring proper fitting and realism.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });

    // Send request to Gemini
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: personImageBase64, mimeType: req.files.person[0].mimetype } },
      { inlineData: { data: clothImageBase64, mimeType: req.files.cloth[0].mimetype } },
    ]);

    const response = result.response;

    // Find image in response
    let imagePart;
    if (response?.candidates?.[0]?.content?.parts) {
      imagePart = response.candidates[0].content.parts.find((part) => part.inlineData);
    }

    if (!imagePart) {
      throw new Error('No image data returned by Gemini.');
    }

    const base64ImageData = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || 'image/png';

    // Convert Base64 → Buffer and send
    const imageBuffer = Buffer.from(base64ImageData, 'base64');
    res.setHeader('Content-Type', mimeType);
    res.send(imageBuffer);

    // Cleanup temp files
    fs.unlinkSync(req.files.person[0].path);
    fs.unlinkSync(req.files.cloth[0].path);

  } catch (err) {
    console.error("ERROR during image generation:", err);
    res.status(500).json({ error: "Image generation failed", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
