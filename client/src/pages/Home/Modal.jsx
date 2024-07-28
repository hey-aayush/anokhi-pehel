import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { months } from '../../constants/Dashboard';
const Modal = ({ isOpen, onClose, blog }) => {
  if (!isOpen) {
    return null;
  }
  const getTimeDifference = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const differenceInMs = now - postDate;
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    
    
    if (differenceInDays > 30) {
      const day = postDate.getDate();
      const month = months[postDate.getMonth()].label;
      const year = postDate.getFullYear();
      return `${month} ${day} ${year}`;
    }
    return `${differenceInDays} days ago`;
    };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-[80%] max-h-[80%] pt-0 pr-6 pb-6 pl-6 relative overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center border-b pt-6 pb-2 mb-4">
          <h2 className="text-xl font-bold text-black">{blog.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="flex justify-between items-center mb-4 text-gray-600">
        <span className="text-sm">{getTimeDifference(blog.createdAt)}</span>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          <img className="w-full object-contain mb-4" src={blog.imageUrl} alt={blog.title} />
        </div>
        <p className="mb-3 font-normal text-black">{blog.description}</p>
        <div className="flex space-x-4">
          {blog.instagramVideoLink && (
            <a href={blog.instagramVideoLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 flex items-center">
              <FaInstagram className="mr-2" /> View on Instagram
            </a>
          )}
          {blog.facebookPostLink && (
            <a href={blog.facebookPostLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 flex items-center">
              <FaFacebook className="mr-2" /> View on Facebook
            </a>
          )}
          {blog.linkedinPostLink && (
            <a href={blog.linkedinPostLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 flex items-center">
              <FaLinkedin className="mr-2" /> View on LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
