"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { calculateCosineSimilarity } from "../utils/feature";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";

export default function Page() {
    const [queries, setQueries] = useState([]);
    const [query, setQuery] = useState("");
    const [ans, setAns] = useState({
        score: 0,
        res: "Query Result Not Found",
    });

    // Fetch all queries on component mount
    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const res = await fetch("/api/userQuery");
            if (!res.ok) {
                throw new Error("Failed to fetch data");
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
        }
    };

    const search = async () => {
        try {
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
            const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const result = await model.embedContent(query);
            const userEmbedding = result.embedding.values;

            let similarQuery = null;
            let highestSimilarity = 0;

            queries.forEach((item) => {
                if (item.embedding) {
                    const similarity = calculateCosineSimilarity(
                        userEmbedding,
                        item.embedding
                    );
                    if (similarity > highestSimilarity) {
                        highestSimilarity = similarity;
                        similarQuery = item;
                    }
                }
            });

            if (highestSimilarity > 0.45) {
                if (similarQuery.solution) {
                    toast.success(`Solution found: ${similarQuery.solution}`);
                    setAns({
                        score: highestSimilarity,
                        res: similarQuery.solution,
                    });
                } else {
                    toast.success(
                        "A similar query exists but no solution has been provided yet."
                    );
                }
            } else {
                toast.info("No similar query exists, please try submitting the form.");
            }
        } catch (error) {
            toast.error(`Error finding similar queries: ${error.message}`);
        } finally {
            setQuery("");
        }
    };

    return (
        <div className="min-h-screen p-6 flex flex-col justify-center items-center text-slate-900">
            {/* <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <p className="text-lg">Cannot find an answer? <br /> Submit your query for assistance.</p>
            </motion.div> */}
            <motion.h1
                className="text-4xl font-bold mb-8 mt-2 text-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                FAQ
            </motion.h1>
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <input
                    aria-label="Enter your query"
                    className="w-full p-4 text-lg rounded-lg mb-4 shadow-lg outline-none text-gray-800 border border-black"
                    style={{ backgroundColor: "#F5F5F5" }}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setAns({
                            score: 0,
                            res: "Query Result Not Found",
                        });
                        setQuery(e.target.value);
                    }}
                    placeholder="Enter your query..."
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={search}
                    className="w-full bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white font-semibold p-4 rounded-lg shadow-lg"
                >
                    Search
                </motion.button>
            </motion.div>
            <motion.div
                className="mt-6 font-bold text-2xl text-center text-slate-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                <p>Similarity Score: {ans.score.toFixed(2)}</p>
                <p>{ans.res}</p>
            </motion.div>
        </div>
    );
}
