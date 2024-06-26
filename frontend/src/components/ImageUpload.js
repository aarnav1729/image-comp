import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';

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
      const response = await axios.post('https://image-comp-3drj.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response data:', response.data); // Log response data
      setCompressionStats(response.data.stats);
    } catch (error) {
      console.error('Error uploading images:', error);
      setCompressionStats([]); // Clear stats on error
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-6 bg-gray-700 text-gray-400">
          <FaCloudUploadAlt size={48} />
          <h2 className="text-xl font-semibold mt-4 text-white">Upload resume</h2>
          <p className="mt-2 text-sm text-gray-400">Drag'n'drop files here to upload. We can accept only .pdf files that are less than 30mb in size.</p>
          <label className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600">
            Select files
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {images.length > 0 && (
            <ul className="mt-4 text-gray-400">
              {Array.from(images).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleUpload}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Upload and Compress
        </button>
        {compressionStats.length > 0 && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Compression Stats:</h3>
            <ul className="space-y-4">
              {compressionStats.map((stat, index) => (
                <li key={index} className="p-4 border border-gray-200 rounded-lg">
                  <img
                    src={`https://image-comp-3drj.onrender.com${stat.path}`}
                    alt={`Compressed ${index}`}
                    className="max-w-full h-auto mb-4"
                  />
                  <p className="text-white font-semibold">Original Size: {(stat.original / 1024).toFixed(2)} KB</p>
                  <p className="text-white font-semibold">Compressed Size: {(stat.compressed / 1024).toFixed(2)} KB</p>
                  <p className="text-white font-semibold">Compression: {stat.percentage}%</p>
                  <a
                    href={`https://image-comp-3drj.onrender.com${stat.path}`}
                    download
                    className="inline-block mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
