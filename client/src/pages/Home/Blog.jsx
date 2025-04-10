import React, { useState } from 'react';
import HomePageLayout from '../../components/Home/HomePageLayout';
import { blogData } from './Blogdata.jsx';
import Modal from './Modal';
import { motion } from 'framer-motion';

const Blog = () => {
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedBlogId((prevId) => (prevId === id ? null : id));
  };

  const getSnippet = (description, isExpanded) => {
    return isExpanded ? description : `${description.slice(0, 100)}...`;
  };

  const closeModal = () => {
    setExpandedBlogId(null);
  };

  const sortBlogsByDate = (blogs) => {
    return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const sortedBlogs = sortBlogsByDate(blogData.blogs);

  return (
    <HomePageLayout>
      <section className=" bg-orange-100 py-8 px-4 mx-auto   max-w-screen-xl lg:py-16 lg:px-6">
        
        <div className="flex justify-center items-center mb-16">
          <h2 className="text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 relative inline-block group">
            Our Blog
            <span className="absolute left-0 -bottom-1 w-0 h-1 bg-teal-500 transition-all duration-500 group-hover:w-full"></span>
          </h2>
        </div>

        
        <h3 className="mb-8 text-3xl lg:text-4xl font-bold text-center text-gray-900">
          Blogs
        </h3>

       
        <div className={`grid gap-12 sm:grid-cols-2 lg:grid-cols-3 ${expandedBlogId ? 'blur-sm' : ''}`}>
          {sortedBlogs.map((blog, index) => {
            const isExpanded = expandedBlogId === blog.id;
            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
                className="max-w-sm bg-white border-2 border-teal-400 rounded-lg shadow dark:bg-gray-800 dark:border-teal-500"
              >
                <a href={blog.link}>
                  <img className="w-full object-cover rounded-t-lg bg-white" src={blog.imageUrl} alt={blog.title} />
                </a>
                <div className="p-5">
                  <a href={blog.link}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-white">{blog.title}</h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                    {getSnippet(blog.description, isExpanded)}
                  </p>
                  <button
                    onClick={() => toggleExpand(blog.id)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-600 hover:bg-teal-700 rounded-lg focus:outline-none"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

     
        {expandedBlogId && (
          <Modal
            isOpen={!!expandedBlogId}
            onClose={closeModal}
            blog={blogData.blogs.find((blog) => blog.id === expandedBlogId)}
          />
        )}
      </section>
    </HomePageLayout>
  );
};

export default Blog;
