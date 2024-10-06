import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send to API)
    console.log('Form Data:', formData);
    alert('Your message has been submitted!');
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <p className="text-lg mb-6 text-center">
          Got any questions or need more information? We’d love to hear from you!
          Reach out to us via <a href="mailto:dummy@email.com" className="text-blue-400 hover:underline">dummy@email.com</a> or fill out the form below:
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg mb-1">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-lg mb-1">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="6"
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
