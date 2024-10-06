"use client";
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { LuArrowUpDown } from 'react-icons/lu';
import ReactPaginate from 'react-paginate';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import TextInput from '@/app/signInForm/TextInput';
import Dropdown from '@/app/signInForm/Dropdown';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Table = ({ role }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [modalData, setModalData] = useState(null);
    const [solution, setSolution] = useState('');
    const [status, setStatus] = useState('inProgress');
    const PER_PAGE = 5;
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/userQuery?role=${role}`);
                const result = await res.json();
                if (result.success) {
                    setData(result.allStudentQueries);
                } else {
                    toast.error('Failed to load data.');
                }
            } catch (error) {
                toast.error(`Error fetching data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [role]);

    useEffect(() => {
        if (!user || !user.publicMetadata.role) {
            router.push('/');
            return;
        }
        const userRole = user.publicMetadata.role;
        if (
            (userRole === 'Student' || userRole === 'Admin') ||
            (userRole === 'Placement_Department' && role !== 'Placement_Department') ||
            (userRole === 'Admission_Department' && role !== 'Admission_Department') ||
            (userRole === 'Scholarships_Department' && role !== 'Scholarships_Department')
        ) {
            router.push('/');
        }
    }, [user, role, router]);

    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(data.length / PER_PAGE);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

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

    const handleSort = () => {
        const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.queries[0].date);
            const dateB = new Date(b.queries[0].date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.queries.some(query => query.urgencyType.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const currentPageData = filteredData.slice(offset, offset + PER_PAGE);

    const handleRowClick = (item) => {
        setModalData(item);
        setSolution('');
        setStatus('inProgress');
    };

    const handleSubmitReply = async () => {
        if (!modalData) return;
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(solution);
        const embedding = result.embedding.values;
        try {
            const response = await fetch(`/api/userQuery`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    queryId: modalData.queries[0]._id,
                    status,
                    solution,
                    embedding
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Reply submitted successfully!');
                setModalData(null);
                setSolution('');
                setStatus('inProgress');
                const res = await fetch(`/api/userQuery?role=${role}`);
                const updatedResult = await res.json();
                if (updatedResult.success) {
                    setData(updatedResult.allStudentQueries);
                } else {
                    toast.error('Failed to reload data.');
                }
            } else {
                toast.error(result.message || 'Failed to submit reply.');
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 w-full h-screen bg-white text-zinc-900"
        >
            <h2 className="text-xl font-bold mb-4">Student Queries</h2>

            <div className="flex items-center justify-between mb-4 rounded-md p-2 bg-[#f8f9fb] text-zinc-900">
                <div className="flex items-center gap-2">
                    <div
                        onClick={handleSort}
                        className="p-2 rounded-md cursor-pointer hover:bg-zinc-300 flex items-center gap-2"
                    >
                        <LuArrowUpDown />
                        <span>Sort by Date</span>
                    </div>
                </div>
                <div className="relative">
                    <FaSearch className="absolute top-3.5 left-2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name or urgency"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-8 py-2 border rounded-lg w-60 bg-[#f8f9fb] text-black border-zinc-300"
                    />
                </div>
            </div>

            {loading ? (
                <div className="mx-auto text-center font-bold text-2xl">Loading...</div>
            ) : (
                <div className="overflow-x-auto rounded-t-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-white bg-blue-800">
                                <th className="p-2">Student Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Query</th>
                                <th className="p-2">Department</th>
                                <th className="p-2">Urgency</th>
                                <th className="p-2">Complaint Time</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Resolved Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item, index) => (
                                <tr
                                    key={item.queries[0]._id} // Use unique key
                                    className="border-b hover:bg-[#f8f9fb] text-black border-zinc-300 cursor-pointer"
                                    onClick={() => handleRowClick(item)}
                                >
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">{item.email}</td>
                                    <td className="p-2">{item.queries[0].content}</td>
                                    <td className="p-2">{item.queries[0].department}</td>
                                    <td className="p-2">{item.queries[0].urgencyType}</td>
                                    <td className="p-2">
                                        {new Date(item.queries[0].date).toLocaleString('en-US', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className={`p-2 ${getStatusClass(item.queries[0].status)}`}>
                                        {item.queries[0].status}
                                    </td>
                                    <td className="p-2">
                                        {item.queries[0].completedAt ?
                                            new Date(item.queries[0].completedAt).toLocaleString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {modalData && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-full mx-2">
                                <h2 className="text-xl font-semibold mb-4 text-black">Reply to the Query</h2>
                                
                                <div className="mb-4">
                                    <label className="block text-black mb-2">Solution</label>
                                    <textarea
                                        value={solution}
                                        onChange={(e) => setSolution(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-[#f8f9fb] text-black border-zinc-300"
                                        placeholder="Enter your solution here..."
                                        rows={4}
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <Dropdown
                                        label="Status"
                                        name="status"
                                        options={['inProgress', 'completed']}
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSubmitReply}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setModalData(null)}
                                        className="bg-gray-600 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end mt-4">
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination flex items-center gap-2'}
                    pageClassName={'p-2 font-bold mx-2 rounded cursor-pointer'}
                    previousClassName={'p-2 font-bold rounded cursor-pointer'}
                    nextClassName={'p-2 font-bold rounded cursor-pointer'}
                    breakClassName={'p-2'}
                    activeClassName={'bg-blue-500 text-white'}
                />
            </div>
        </motion.div>
    );
};

export default Table;
