const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const mozjpeg = require('mozjpeg');
const cors = require('cors');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://peic.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

const upload = multer({ dest: 'uploads/' });

// Ensure temp and compressed directories exist
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExistence(path.join(__dirname, 'temp'));
ensureDirectoryExistence(path.join(__dirname, 'compressed'));

// Function to log file sizes and calculate compression percentage
const logFileSize = (filePath, description) => {
  const stats = fs.statSync(filePath);
  console.log(`${description}: ${filePath} - ${stats.size / 1024} KB`);
  return stats.size;
};

// Serve static files from the 'compressed' directory
app.use('/compressed', express.static(path.join(__dirname, 'compressed')));

app.post('/upload', upload.array('images'), (req, res) => {
  const files = req.files;
  const compressionStats = [];
  let processedFiles = 0;

  const processFile = (file) => {
    const inputPath = path.join(__dirname, 'uploads', file.filename);
    const tempPath = path.join(__dirname, 'temp', file.originalname); // Temporary file before cjpeg
    const outputPath = path.join(__dirname, 'compressed', file.originalname);

    // Log original file size
    const originalSize = logFileSize(inputPath, 'Original file');

    // First, convert image to PNG format using sharp to ensure we have an uncompressed version
    sharp(inputPath)
      .png()
      .toFile(tempPath, (err) => {
        if (err) {
          console.error('Error converting to PNG:', err);
          return res.status(500).json({ error: 'Error converting to PNG' });
        }

        // Log size after sharp conversion to PNG
        logFileSize(tempPath, 'After sharp to PNG');

        // Then, use mozjpeg for aggressive compression
        execFile(mozjpeg, ['-quality', '70', '-optimize', '-progressive', '-outfile', outputPath, tempPath], (error, stdout, stderr) => {
          if (error) {
            console.error(`Error during mozjpeg execution: ${error}`);
            return res.status(500).json({ error: 'Error during mozjpeg execution' });
          }
          console.log(`mozjpeg stdout: ${stdout}`);
          console.log(`mozjpeg stderr: ${stderr}`);

          // Log size after mozjpeg compression
          const compressedSize = logFileSize(outputPath, 'After mozjpeg compression');

          // Calculate and log compression percentage
          const compressionPercentage = ((originalSize - compressedSize) / originalSize) * 100;
          console.log(`Compression percentage: ${compressionPercentage.toFixed(2)}%`);

          // Store compression stats
          compressionStats.push({
            original: originalSize,
            compressed: compressedSize,
            percentage: compressionPercentage.toFixed(2),
            path: `/compressed/${file.originalname}`,
          });

          // Clean up temporary file
          fs.unlinkSync(tempPath);
          fs.unlinkSync(inputPath); // Remove the original file

          processedFiles++;
          if (processedFiles === files.length) {
            res.json({ stats: compressionStats });
          }
        });
      });
  };

  files.forEach((file) => processFile(file));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});