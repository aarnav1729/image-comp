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
          This application allows you to compress images using a combination of Sharp and MozJPEG. The process involves:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Selecting images to upload.</li>
          <li>Uploading images to the server.</li>
          <li>Converting images to PNG format using Sharp.</li>
          <li>Compressing the PNG images using MozJPEG to achieve a high level of compression.</li>
          <li>Displaying the compressed images along with their stats and providing a download link.</li>
        </ol>
      </div>
    </div>
  );
};

export default How;