import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-blue-500 text-white py-4 px-6 flex justify-between items-center">
      <Link to="/how" className="text-lg font-semibold hover:underline">How?</Link>
      <Link to="/" className="text-2xl font-bold hover:underline">Image Compressor</Link>
      <a
        href="https://github.com/aarnav1729/image-comp.git" // Replace with your GitHub repo link
        target="_blank"
        rel="noopener noreferrer"
        className="text-xl hover:text-gray-300"
      >
        <FaGithub />
      </a>
    </header>
  );
};

export default Header;