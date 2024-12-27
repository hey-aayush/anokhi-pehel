import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePageLayout from '../../components/Home/HomePageLayout';
import Modal from './Modal';
import { BASE_URL } from '../../Service/helper';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/blog`);
        setBlogs(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
        setLoading(false);
      }
    };

    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found in localStorage');
          setIsAdmin(false);
          return;
        }

        const { data } = await axios.get(`${BASE_URL}/userData`, {
          headers: {
            Authorization: token,
          },
        });

        if (data.success && data.data) {
          const user = data.data;

          if (user.isActive && user.isAdmin) {
            setIsAdmin(true);
          } else {
            console.warn('User is not an admin or is inactive');
            setIsAdmin(false);
          }
        } else {
          console.error('Failed to fetch user data');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    fetchBlogs();
    checkAdmin();
  }, []);

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
    if (!Array.isArray(blogs)) return [];
    return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      alert('Blog deleted successfully.');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/blog-form/${id}`);
  };

  const sortedBlogs = sortBlogsByDate(blogs);

  return (
    <HomePageLayout>
      <section className="bg-white py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900">
            Our Blog
          </h2>
        </div>

        {/* Conditionally Render Create Blog Button for Admin */}
        {isAdmin && (
          <div className="mb-8 text-center">
            <button
              onClick={() => navigate('/blog-form')} // Navigate to blog-form route
              className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Create Blog
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <p className="text-lg text-gray-500">Loading blogs...</p>
          </div>
        ) : (
          <div>
            <h3 className="mb-8 text-3xl lg:text-4xl font-bold text-gray-900">Blogs</h3>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {sortedBlogs.map((blog) => {
                const isExpanded = expandedBlogId === blog._id;
                return (
                  <div
                    key={blog._id}
                    className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                    <a href={blog.link}>
                      <img
                        className="w-full object-cover rounded-t-lg bg-white"
                        src={blog.imageUrl}
                        alt={blog.title}
                      />
                    </a>
                    <div className="p-5">
                      <a href={blog.link}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-white">
                          {blog.title}
                        </h5>
                      </a>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                        {getSnippet(blog.description, isExpanded)}
                      </p>
                      <button
                        onClick={() => toggleExpand(blog._id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:focus dark:hover dark:focus"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                      {isAdmin && (
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => handleEdit(blog._id)}
                            className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {expandedBlogId && (
          <Modal
            isOpen={!!expandedBlogId}
            onClose={closeModal}
            blog={blogs.find((blog) => blog._id === expandedBlogId)}
          />
        )}
      </section>
    </HomePageLayout>
  );
};

export default Blog;

