// backend/server.js
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Path to cjpeg binary
const cjpegPath = '/usr/local/opt/mozjpeg/bin/cjpeg';

// Function to log file sizes
const logFileSize = (filePath, description) => {
  const stats = fs.statSync(filePath);
  console.log(`${description}: ${filePath} - ${stats.size / 1024} KB`);
};

app.post('/upload', upload.array('images'), async (req, res) => {
  try {
    const files = req.files;
    const compressedFiles = [];

    for (let file of files) {
      const inputPath = path.join(__dirname, 'uploads', file.filename);
      const tempPath = path.join(__dirname, 'temp', file.originalname); // Temporary file before cjpeg
      const outputPath = path.join(__dirname, 'compressed', file.originalname);

      // Log original file size
      logFileSize(inputPath, 'Original file');

      // First, convert image to PNG format using sharp to ensure we have an uncompressed version
      await sharp(inputPath)
        .png()
        .toFile(tempPath);

      // Log size after sharp conversion to PNG
      logFileSize(tempPath, 'After sharp to PNG');

      // Then, use cjpeg for aggressive compression
      exec(`${cjpegPath} -quality 70 -optimize -progressive -outfile ${outputPath} ${tempPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error during cjpeg execution: ${error}`);
          return;
        }
        console.log(`cjpeg stdout: ${stdout}`);
        console.log(`cjpeg stderr: ${stderr}`);

        // Log size after cjpeg compression
        logFileSize(outputPath, 'After cjpeg compression');

        // Clean up temporary file
        fs.unlinkSync(tempPath);

        // Add compressed file to the response list
        compressedFiles.push(outputPath);
      });

      fs.unlinkSync(inputPath); // Remove the original file
    }

    // Delay the response until all images are processed
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds for async tasks to complete

    res.json({ message: 'Images compressed successfully', files: compressedFiles });
  } catch (error) {
    console.error('Error compressing images:', error);
    res.status(500).json({ error: 'Error compressing images' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});