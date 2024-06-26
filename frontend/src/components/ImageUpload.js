import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [compressionStats, setCompressionStats] = useState([]);

  const handleFileChange = (event) => {
    setImages(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCompressionStats(response.data.stats);
    } catch (error) {
      console.error('Error uploading images:', error);
      setCompressionStats([]); // Clear stats on error
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Compress</button>
      {compressionStats.length > 0 && (
        <div>
          <h3>Compression Stats:</h3>
          <ul>
            {compressionStats.map((stat, index) => (
              <li key={index}>
                <img src={`http://localhost:5000${stat.path}`} alt={`Compressed ${index}`} style={{ maxWidth: '300px', margin: '10px 0' }} />
                <p>Original Size: {(stat.original / 1024).toFixed(2)} KB</p>
                <p>Compressed Size: {(stat.compressed / 1024).toFixed(2)} KB</p>
                <p>Compression: {stat.percentage}%</p>
                <a href={`http://localhost:5000${stat.path}`} download>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;