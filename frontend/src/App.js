import React from 'react';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Compressor</h1>
      <ImageUpload />
    </div>
  );
}

export default App;