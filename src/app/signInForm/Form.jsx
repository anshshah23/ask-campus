"use client";
import React, { useState, useEffect } from 'react';
import TextInput from './TextInput';
import Dropdown from './Dropdown';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaPhone, FaUserTie } from 'react-icons/fa';  // Icons for inputs
import { motion } from 'framer-motion';  // For animations

const roles = [
  'Student',
  'Admin',
  'Placement_Department',
  'Admission_Department',
  'Scholarships_Department',
  'NULL'
];

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    role: roles[0],
  });

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        email: user?.primaryEmailAddress?.emailAddress || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/userRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phoneNo: formData.phone,
          role: formData.role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push('/');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Select Your Role
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Note: This cannot be changed later!
        </p>

        <div className="mb-4 relative">
          <TextInput
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
            placeholder="Enter your phone number"
            className="pl-10 text-lg"
          />
        </div>

        <div className="mb-6 relative">
          <Dropdown
            label="Role"
            name="role"
            options={roles}
            value={formData.role}
            onChange={handleInputChange}
            className="pl-10 text-lg"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 text-lg font-semibold text-white rounded-xl transition-all duration-300 ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-red-500"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            "Submit"
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default SignInForm;