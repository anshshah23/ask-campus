"use client";
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const QueryHistoryPage = () => {
  const [queryData, setQueryData] = useState([]);
  const { user } = useUser();
  const getFunc = async () => {
    try {
      const res = await fetch(`/api/userQueries?email=${user?.primaryEmailAddress?.emailAddress}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      if (!result.queries) {
        throw new Error('No queries found in the response');
      }

      setQueryData(result.queries);
      console.log(result.queries);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    getFunc();
  }, []);



  return (
    <div className="w-full h-full bg-white text-black p-8 rounded-lg">
      <h2 className="text-3xl mb-6">Your Query History</h2>

      {/* Table of Queries */}
      <div className="overflow-x-auto rounded-t-2xl shadow-lg mb-10">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="py-2 px-4">Query</th>
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4">Urgency</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date Submitted</th>
              <th className="py-2 px-4">Completion Date</th>
            </tr>
          </thead>
          <tbody>
            {queryData.map((query, index) => (
              <tr key={index} className="bg-gray-100 border-b text-center">
                <td className="py-2 px-4 text-left">{query.content}</td>
                <td className="py-2 px-4">{query.department}</td>
                <td className="py-2 px-4">{query.urgencyType}</td>
                <td className={`py-2 px-4 ${query.status === 'completed' ? 'text-green-600' : query.status === 'inProgress' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {query.status}
                </td>
                <td className="py-2 px-4">{
                  new Date(query.date).toLocaleString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }</td>
                <td className="py-2 px-4">{query.completedAt ? new Date(query.date).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueryHistoryPage;
