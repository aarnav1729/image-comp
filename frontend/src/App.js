import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import How from './components/How';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/how" element={<How />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;