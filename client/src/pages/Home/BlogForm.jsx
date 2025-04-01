import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../Service/helper';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState({
        title: '',
        imageUrl: '',
        description: '',
        instagramPostLink: '',
        linkedinPostLink: '',
        facebookPostLink: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch existing blog data for editing
        const fetchBlog = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const { data } = await axios.get(`${BASE_URL}/blog/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setBlog(data);
                } catch (error) {
                    alert(error.response?.data?.error || 'Error fetching blog data');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        setBlog({ ...blog, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
            if (id) {
                // Update existing blog
                await axios.put(`${BASE_URL}/blog/${id}`, blog, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Blog updated successfully');
            } else {
                // Create a new blog
                await axios.post(`${BASE_URL}/blog`, blog, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Blog created successfully');
            }
            navigate('/blogs'); // Redirect to blog page after success
        } catch (error) {
            alert(error.response?.data?.error || 'Error submitting blog');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    <div className="border-b border-gray-900/10 pb-8">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            {id ? 'Update Blog' : 'Create a New Blog'}
                        </h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={blog.title}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="sm:col-span-4">
                                <label htmlFor="imageUrl" className="block text-sm font-medium leading-6 text-gray-900">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    id="imageUrl"
                                    value={blog.imageUrl}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={blog.description}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="instagramPostLink" className="block text-sm font-medium leading-6 text-gray-900">
                                    Instagram Post Link
                                </label>
                                <input
                                    type="url"
                                    name="instagramPostLink"
                                    id="instagramPostLink"
                                    value={blog.instagramPostLink}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="linkedinPostLink" className="block text-sm font-medium leading-6 text-gray-900">
                                    LinkedIn Post Link
                                </label>
                                <input
                                    type="url"
                                    name="linkedinPostLink"
                                    id="linkedinPostLink"
                                    value={blog.linkedinPostLink}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="facebookPostLink" className="block text-sm font-medium leading-6 text-gray-900">
                                    Facebook Post Link
                                </label>
                                <input
                                    type="url"
                                    name="facebookPostLink"
                                    id="facebookPostLink"
                                    value={blog.facebookPostLink}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200"
                    >
                        {id ? 'Update Blog' : 'Create Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
