"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BackgroundGradientDemo } from './Box';

const Page = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/userQuery');
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            if (data.success) {
                const allQueries = data.allStudentQueries.reduce((acc, student) => {
                    return acc.concat(student.queries);
                }, []);
                setQueries(allQueries);
            } else {
                setQueries([]);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generatePdfReport = async () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Student Queries Report", 14, 22);
        doc.setFontSize(12);
        doc.text(`Total Queries: ${queries.length}`, 14, 32);
        doc.text(`Completed Queries: ${queries.filter(query => query.status === "completed").length}`, 14, 42);
        doc.text(`In Progress Queries: ${queries.filter(query => query.status === "inProgress").length}`, 14, 52);
        doc.text(`Pending Queries: ${queries.filter(query => query.status === "pending").length}`, 14, 62);
    
        const departmentSummary = queries.reduce((acc, query) => {
            const dept = query.department;
            if (!acc[dept]) {
                acc[dept] = { pending: 0, inProgress: 0, completed: 0 };
            }
            acc[dept][query.status] += 1;
            return acc;
        }, {});
    
        let yOffset = 72;
        Object.keys(departmentSummary).forEach((department, index) => {
            const dept = departmentSummary[department];
            doc.text(
                `${department} Department - Pending: ${dept.pending}, In Progress: ${dept.inProgress}, Completed: ${dept.completed}`,
                14,
                yOffset + index * 10
            );
        });
    
        const input = document.getElementById("charts");
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true
        });
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, yOffset + Object.keys(departmentSummary).length * 10, 190, 100);
    
        const pdfBlob = doc.output("blob");
    
        // Convert the Blob to Base64 for sending via email
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1]; // Extract only the Base64 data
    
            try {
                const response = await fetch("/api/sendReport", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ pdfBlob: base64String }),
                });
    
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    toast.success("Report generated and sent!");
                } else {
                    toast.error("Failed to send report.");
                }
            } catch (error) {
                toast.error(`Error sending report: ${error.message}`);
            }
        };
    };

    const boxes = [
        { name: 'Total Queries', number: queries.length },
        { name: 'Completed Queries', number: queries.filter(query => query.status === 'completed').length },
        { name: 'In Progress Queries', number: queries.filter(query => query.status === 'inProgress').length },
        { name: 'Pending Queries', number: queries.filter(query => query.status === 'pending').length },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const pieData = [
        { name: 'Pending', value: queries.filter(query => query.status === 'pending').length },
        { name: 'In Progress', value: queries.filter(query => query.status === 'inProgress').length },
        { name: 'Completed', value: queries.filter(query => query.status === 'completed').length },
    ];

    const barData = [
        { name: 'Queries', Pending: queries.filter(query => query.status === 'pending').length, Completed: queries.filter(query => query.status === 'completed').length, InProgress: queries.filter(query => query.status === 'inProgress').length },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'inProgress':
                return 'text-blue-500';
            case 'completed':
                return 'text-green-500';
            case 'pending':
                return 'text-yellow-500';
            default:
                return '';
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    return (
        <div className="flex flex-col mx-4 md:mx-10 my-8">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h2>
                <button onClick={generatePdfReport} className="bg-blue-500 px-4 py-2 rounded-xl mb-2 lg:mb-0 text-white">Create Report</button>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                id="charts" // Add this id for html2canvas to target
                className="flex flex-col md:flex-row w-full flex-wrap bg-white text-zinc-900 gap-4"
            >
                <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
                    <div className="flex flex-wrap gap-x-4 gap-y-4 w-full md:w-1/3 h-full">
                        {boxes.map((data, index) => (
                            <div key={index} className="w-[47%] h-auto">
                                <BackgroundGradientDemo>
                                    <div
                                        key={index}
                                        className="text-white transition-transform duration-700 transform hover:scale-100 hover:shadow-lg py-2 md:py-6 px-6 w-full h-1/3 md:h-full rounded-3xl"
                                        style={{ aspectRatio: '1 / 1' }} // Makes it square
                                    >
                                        <div className="text-md font-bold">{data.name}</div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-2xl font-bold">{data.number}</span>
                                        </div>
                                    </div>
                                </BackgroundGradientDemo>
                            </div>
                        ))}
                    </div>

                    {/* Pie Chart Container */}
                    <div className="transition-transform duration-700 transform hover:scale-105 w-full md:w-[30%] rounded-3xl py-6 px-4 bg-zinc-100 text-black">
                        <div className="font-bold text-center md:text-left">Query Pie Chart</div>
                        <div className="w-full flex justify-center">
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                        <div>
                            {pieData.map((data, index) => (
                                <div className="flex py-1 justify-between" key={index}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            style={{ backgroundColor: COLORS[index], width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block' }}
                                        ></span>
                                        <span>{data.name}</span>
                                    </div>
                                    <span>{data.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="transition-transform duration-700 transform hover:scale-105 w-full md:w-[30%] rounded-3xl py-6 px-4 bg-zinc-100 text-black">
                        <div className="font-bold text-center md:text-left">Query Bar Chart</div>
                        <div className="w-full h-[400px]">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={barData}
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Pending" fill="#FFBB28" />
                                    <Bar dataKey="Completed" fill="#82ca9d" />
                                    <Bar dataKey="InProgress" fill="#0088FE" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-4 mt-10"
            >
                <h2 className="text-2xl font-bold">Queries Overview</h2>
                <div className="overflow-x-auto  rounded-t-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-white bg-blue-800">
                                <th className="p-2">Query</th>
                                <th className="p-2">Department</th>
                                <th className="p-2">Urgency</th>
                                <th className="p-2">Complaint Time</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Resolved Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.map((query, index) => (
                                <tr key={index} className="border-b hover:bg-[#f8f9fb] md:font-semibold text-black border-zinc-300">
                                    <td className="p-2">{query.content}</td>
                                    <td className="p-2">{query.department}</td>
                                    <td className="p-2">{query.urgencyType}</td>
                                    <td className="p-2">
                                        {new Date(query.date).toLocaleString('en-US', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className={`p-2 ${getStatusClass(query.status)}`}>
                                        {query.status}
                                    </td>
                                    <td className="p-2">
                                        {query.completedAt ?
                                            new Date(query.completedAt).toLocaleString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            :
                                            'N/A'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;