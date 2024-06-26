import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const How = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <Link to="/" className="text-blue-500 hover:text-blue-700 mb-4 flex items-center">
          <FaArrowLeft className="mr-2" />
          Back
        </Link>
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-700 mb-4">
          Our Image Compressor utilizes advanced image processing techniques to significantly reduce the size of your images while maintaining high quality. Here's a detailed breakdown of how it all works:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            <strong>Image Selection:</strong> Users begin by selecting the images they wish to compress using our intuitive file input system. This ensures ease of use and quick selection of multiple images.
          </li>
          <li>
            <strong>File Upload:</strong> The selected images are uploaded to our server. This step involves transmitting the files securely to ensure user data privacy and integrity.
          </li>
          <li>
            <strong>Format Conversion:</strong> Once uploaded, the images are initially converted to PNG format using the <a href="https://sharp.pixelplumbing.com/" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">Sharp</a> library. Sharp is a high-performance image processing library that provides fast and efficient conversions, ensuring the images are in a standardized, uncompressed format for further processing.
          </li>
          <li>
            <strong>Lossless Compression:</strong> The converted PNG images are then passed through <a href="https://github.com/mozilla/mozjpeg" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">MozJPEG</a>, a JPEG encoder that optimizes compression while maintaining image quality. MozJPEG applies advanced compression algorithms to reduce file size without sacrificing visual fidelity, resulting in significantly smaller images that are virtually indistinguishable from the originals.
          </li>
          <li>
            <strong>Quality Assurance:</strong> Throughout the compression process, we log and monitor file sizes to ensure that the compression meets our high standards. This includes calculating the compression percentage to provide users with clear, quantitative feedback on the effectiveness of the process.
          </li>
          <li>
            <strong>Result Display:</strong> The compressed images are displayed on the user's screen along with their original and compressed sizes, and the compression percentage. Users can visually compare the images and download the compressed versions directly.
          </li>
        </ol>
        <p className="text-gray-700 mt-4">
          By leveraging state-of-the-art image processing libraries like Sharp and MozJPEG, our Image Compressor ensures that users receive the best possible balance between file size reduction and image quality. This makes it ideal for web developers, photographers, and anyone looking to optimize their images for faster loading times and better storage efficiency.
        </p>
      </div>
    </div>
  );
};

export default How;