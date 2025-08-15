import React, { useState } from 'react';

function AdminPostForms() {
  // Announcement states
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState('');
  const [announcementError, setAnnouncementError] = useState('');

  // Category states
  const [categoryName, setCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Department states
  const [departmentName, setDepartmentName] = useState('');
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [departmentSuccess, setDepartmentSuccess] = useState('');
  const [departmentError, setDepartmentError] = useState('');

  // Handle Announcement submit
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setAnnouncementLoading(true);
    setAnnouncementSuccess('');
    setAnnouncementError('');

    const announcementData = {
      title: announcementTitle.trim(),
      description: announcementContent.trim(),
      createdDate: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8080/api/announcements', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }

      setAnnouncementTitle('');
      setAnnouncementContent('');
      setAnnouncementSuccess('Announcement posted successfully!');
    } catch (error) {
      setAnnouncementError(error.message);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  // Handle Category submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryLoading(true);
    setCategorySuccess('');
    setCategoryError('');

    const categoryData = {
      name: categoryName.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }

      setCategoryName('');
      setCategorySuccess('Category added successfully!');
    } catch (error) {
      setCategoryError(error.message);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle Department submit
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    setDepartmentLoading(true);
    setDepartmentSuccess('');
    setDepartmentError('');

    const departmentData = {
      name: departmentName.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8080/api/department', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }

      setDepartmentName('');
      setDepartmentSuccess('Department added successfully!');
    } catch (error) {
      setDepartmentError(error.message);
    } finally {
      setDepartmentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        🛠️ Admin Post Forms
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Announcement Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
            Create Announcement
          </h2>
          <form onSubmit={handleAnnouncementSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="announcementTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="announcementTitle"
                type="text"
                required
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement title"
                disabled={announcementLoading}
              />
            </div>
            <div>
              <label
                htmlFor="announcementContent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="announcementContent"
                rows={4}
                required
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement content"
                disabled={announcementLoading}
              />
            </div>
            <button
              type="submit"
              disabled={announcementLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
            >
              {announcementLoading ? 'Posting...' : 'Post Announcement'}
            </button>
            {announcementSuccess && (
              <p className="mt-4 text-green-600 font-semibold text-center">
                {announcementSuccess}
              </p>
            )}
            {announcementError && (
              <p className="mt-4 text-red-600 font-semibold text-center">
                {announcementError}
              </p>
            )}
          </form>
        </div>

        {/* Category Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-700 text-center">
            Add Category
          </h2>
          <form onSubmit={handleCategorySubmit} className="space-y-5">
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Category name"
                disabled={categoryLoading}
              />
            </div>
            <button
              type="submit"
              disabled={categoryLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
            >
              {categoryLoading ? 'Adding...' : 'Add Category'}
            </button>
            {categorySuccess && (
              <p className="mt-4 text-green-600 font-semibold text-center">
                {categorySuccess}
              </p>
            )}
            {categoryError && (
              <p className="mt-4 text-red-600 font-semibold text-center">
                {categoryError}
              </p>
            )}
          </form>
        </div>

        {/* Department Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-purple-700 text-center">
            Add Department
          </h2>
          <form onSubmit={handleDepartmentSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="departmentName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department Name
              </label>
              <input
                id="departmentName"
                type="text"
                required
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Department name"
                disabled={departmentLoading}
              />
            </div>
            <button
              type="submit"
              disabled={departmentLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
            >
              {departmentLoading ? 'Adding...' : 'Add Department'}
            </button>
            {departmentSuccess && (
              <p className="mt-4 text-green-600 font-semibold text-center">
                {departmentSuccess}
              </p>
            )}
            {departmentError && (
              <p className="mt-4 text-red-600 font-semibold text-center">
                {departmentError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminPostForms;
