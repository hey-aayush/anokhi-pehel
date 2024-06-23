import React, { useState } from 'react';
import HomePageLayout from '../../components/Home/HomePageLayout';
import { blogData } from './Blogdata.jsx';
import Modal from './Modal';

const Blog = () => {
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedBlogId((prevId) => (prevId === id ? null : id));
  };

  const getSnippet = (description, isExpanded) => {
    return isExpanded ? description : `${description.slice(0, 100)}...`;
  };

  const getTimeDifference = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const differenceInMs = now - postDate;
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    return `${differenceInDays} days ago`;
  };

  const closeModal = () => {
    setExpandedBlogId(null);
  };

  const expandedBlog = blogData.blogs.find((blog) => blog.id === expandedBlogId);

  return (
    <HomePageLayout>
      <section className="bg-white py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900">
            Our Blog
          </h2>
        </div>
        <div>
          <h3 className="mb-8 text-3xl lg:text-4xl font-bold text-gray-900">
            Blogs
          </h3>
          <div className={`grid gap-12 sm:grid-cols-2 lg:grid-cols-3 ${expandedBlogId ? 'blur-sm' : ''}`}>
            {blogData.blogs.map((blog) => {
              const isExpanded = expandedBlogId === blog.id;
              const timeDifference = getTimeDifference(blog.createdAt);
              return (
                <div key={blog.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:focus dark:hover dark:focus"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                      <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="text-gray-600 mt-4 ml-2">
                      <span>{timeDifference}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {expandedBlogId && (
          <Modal isOpen={!!expandedBlogId} onClose={closeModal} blog={expandedBlog} />
        )}
      </section>
    </HomePageLayout>
  );
};

export default Blog;
