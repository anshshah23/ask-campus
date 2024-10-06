"use client";
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { LuArrowUpDown } from 'react-icons/lu';
import ReactPaginate from 'react-paginate';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Table = ({ role }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrderDate, setSortOrderDate] = useState('asc');
    const [sortOrderName, setSortOrderName] = useState('asc');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const PER_PAGE = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/userQuery?role=${role}`);
                const result = await res.json();
                // console.log(result.allStudentQueries);
                if (result.success) {
                    setData(result.allStudentQueries);
                }
                setLoading(false);
            } catch (error) {
                toast.error('Error fetching data:', error.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [role]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

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

    const handleSortDate = () => {
        const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.queries[0].date);
            const dateB = new Date(b.queries[0].date);
            return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setData(sortedData);
        setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
    };

    const handleSortName = () => {
        const sortedData = [...data].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return sortOrderName === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        setData(sortedData);
        setSortOrderName(sortOrderName === 'asc' ? 'desc' : 'asc');
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        item.urgencyType.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const currentPageData = filteredData.slice(offset, offset + PER_PAGE);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 w-full h-screen bg-white text-zinc-900">

            <h2 className="text-xl font-bold mb-4">Student Queries</h2>

            <div className="flex items-center justify-between mb-4 rounded-md p-2 bg-[#f8f9fb] text-zinc-900">
                <div className="flex items-center gap-2">
                    <div 
                        onClick={handleSortDate} 
                        className="p-2 rounded-md cursor-pointer hover:bg-zinc-100 flex items-center gap-2"
                    >
                        <LuArrowUpDown />
                        <span>Sort by Date</span>
                    </div>
                    <div 
                        onClick={handleSortName} 
                        className="p-2 rounded-md cursor-pointer hover:bg-zinc-100 flex items-center gap-2"
                    >
                        <LuArrowUpDown />
                        <span>Sort by Name</span>
                    </div>
                </div>
                <div className="relative">
                    <FaSearch className="absolute top-3.5 left-2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name or urgency"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 py-2 border rounded-lg w-15 bg-[#f8f9fb] text-black border-zinc-300"
                    />
                </div>
            </div>

            {loading ? (
                <div className="mx-auto text-center font-bold text-2xl">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-black">
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
                                <tr key={index} className="border-b hover:bg-[#f8f9fb] text-black border-zinc-300">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">{item.email}</td>
                                    <td className="p-2">{item.queries[0].query}</td>
                                    <td className="p-2">{item.department}</td>
                                    <td className="p-2">{item.urgencyType}</td>

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
                                            : 
                                            'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                    pageClassName={'p-2 font-bold mx-2 rounded'}
                    previousClassName={'p-2 font-bold rounded'}
                    nextClassName={'p-2 font-bold rounded'}
                    breakClassName={'p-2'}
                    activeClassName={'bg-white text-zinc-900 hover:bg-zinc-300'}
                />
            </div>
        </motion.div>
    );
};

export default Table;
