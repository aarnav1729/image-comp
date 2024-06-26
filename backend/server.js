// backend/server.js
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Path to cjpeg binary
const cjpegPath = '/usr/local/opt/mozjpeg/bin/cjpeg';

// Promisify exec for async/await
const execPromise = util.promisify(exec);

// Function to log file sizes and calculate compression percentage
const logFileSize = (filePath, description) => {
  const stats = fs.statSync(filePath);
  console.log(`${description}: ${filePath} - ${stats.size / 1024} KB`);
  return stats.size;
};

app.post('/upload', upload.array('images'), async (req, res) => {
  try {
    const files = req.files;
    const compressedFiles = [];
    const compressionStats = [];

    for (let file of files) {
      const inputPath = path.join(__dirname, 'uploads', file.filename);
      const tempPath = path.join(__dirname, 'temp', file.originalname); // Temporary file before cjpeg
      const outputPath = path.join(__dirname, 'compressed', file.originalname);

      // Log original file size
      const originalSize = logFileSize(inputPath, 'Original file');

      // First, convert image to PNG format using sharp to ensure we have an uncompressed version
      await sharp(inputPath)
        .png()
        .toFile(tempPath);

      // Log size after sharp conversion to PNG
      logFileSize(tempPath, 'After sharp to PNG');

      // Then, use cjpeg for aggressive compression
      await execPromise(`${cjpegPath} -quality 70 -optimize -progressive -outfile ${outputPath} ${tempPath}`);

      // Log size after cjpeg compression
      const compressedSize = logFileSize(outputPath, 'After cjpeg compression');

      // Calculate and log compression percentage
      const compressionPercentage = ((originalSize - compressedSize) / originalSize) * 100;
      console.log(`Compression percentage: ${compressionPercentage.toFixed(2)}%`);

      // Store compression stats
      compressionStats.push({
        original: originalSize,
        compressed: compressedSize,
        percentage: compressionPercentage.toFixed(2),
      });

      // Clean up temporary file
      fs.unlinkSync(tempPath);

      // Add compressed file to the response list
      compressedFiles.push(outputPath);

      fs.unlinkSync(inputPath); // Remove the original file
    }

    res.json({ stats: compressionStats });
  } catch (error) {
    console.error('Error compressing images:', error);
    res.status(500).json({ error: 'Error compressing images', details: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});