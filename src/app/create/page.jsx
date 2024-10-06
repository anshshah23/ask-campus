"use client";
import React, { useState, useEffect } from 'react';
import TextInput from '../signInForm/TextInput';
import Dropdown from '../signInForm/Dropdown';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);

const departments = [
  'Placement',
  'Admission',
  'Scholarship',
  'NULL'
];

const urgencies = [
  'Low',
  'Medium',
  'High',
];

const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoadig] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    department: departments[0],
    query: '',
    urgencyType: urgencies[0],
  });

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        email: user?.primaryEmailAddress?.emailAddress || '',
        name: user?.fullName || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadig(true);
    let dept = formData.department;

    // Check if department is NULL, and use AI model to infer the relevant department
    if (dept === "NULL") {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Based on the provided information, identify the most relevant department and provide a single-word answer from the following options: [Admission, Scholarship, Placement]. Query: ${formData.query}`;
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      dept = responseText.trim();
    }

    try {
      // Submit user query to the backend
      const response = await fetch('/api/userQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phoneNo: formData.phone,
          query: {
            department: dept,
            content: formData.query,
            urgencyType: formData.urgencyType,
          },
          name: formData.name,
        }),
      });

      if (formData.urgencyType === "High") {
        const emailResponse = await fetch('/api/sendMail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phoneNo: formData.phone,
            query: formData.query,
            department: formData.department,
            urgencyType: formData.urgencyType,
          }),
        });

        const emailData = await emailResponse.json();
        if (!emailResponse.ok) {
          toast.error(emailData.message || 'Failed to send high urgency notification.');
        } else {
          toast.success('High urgency email notification sent!');
        }
      }

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push('/viewHistory');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoadig(false);
    }
  };


  return (
    <div className="h-screen w-screen bg-slate-200 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="max-w-4xl isolate aspect-video w-full p-16 rounded-xl bg-white/10 shadow-xl hover:shadow-2xl duration-300 ring-1 ring-black/5">
        <h2 className="text-2xl text-black mb-4">Submit Your Query</h2>

        <TextInput
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          type="tel"
        />

        <Dropdown
          label="Department"
          name="department"
          options={departments}
          value={formData.department}
          onChange={handleInputChange}
        />

        <Dropdown
          label="Urgency"
          name="urgencyType"
          options={urgencies}
          value={formData.urgencyType}
          onChange={handleInputChange}
        />

        <TextInput
          label="Query"
          name="query"
          value={formData.query}
          onChange={handleInputChange}
          type="text"
          multiline
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-800 text-white font-bold hover:bg-blue-900 transition duration-300"
        >
          {
            loading ? "Submitting..." : "Submit Query"
          }
        </button>
      </form>
    </div>
  );
};

export default Page;
