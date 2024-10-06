"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import heroImage from "./College-ERP-software.png";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ThreeDCardDemo } from "./floatingImage";
import { CardHoverEffectDemo } from "./Box";

export default function Hero() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user && !user?.publicMetadata?.role) {
            router.push("/signInForm");
        }
    }, [user, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-300 text-slate-800 transition-all duration-300">
            <div className="container px-6 lg:px-8">
                {/* Hero Section */}
                <div className="flex flex-col my-4 lg:flex-row items-center justify-between">
                    <motion.div
                        className="text-center lg:text-left lg:w-1/2"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-xl md:text-2xl font-bold leading-tight mb-10">
                            Effortlessly Manage{" "}
                            <br />
                            <span className="text-indigo-600 text-2xl md:text-6xl">Student Inquiries</span>
                        </h1>
                        <p className="text-xl mb-10">
                            A smarter way for educational institutions to organize, track,
                            and respond to student inquiries. With automated routing and
                            real-time tracking, simplify student communication like never before.
                        </p>
                        <Link href="/features">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(13, 110, 253, 1)" }}
                                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300"
                            >
                                Explore Features
                            </motion.button>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="relative w-full lg:w-1/2 mt-0"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ThreeDCardDemo />
                    </motion.div>
                </div>

                {/* Metrics Section */}
                {/* Metrics Section */}
                <motion.div
                    className="flex flex-col md:flex-row mt-20 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    <div className="flex-1">
                        <CardHoverEffectDemo />
                    </div>
                </motion.div>
            </div>

            {/* Section 2: How it Works */}
            <div className="container mx-auto px-6 lg:px-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-8 bg-green-500 text-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <h2 className="text-4xl font-bold mb-4">Automated Routing</h2>
                        <p className="text-lg">
                            Inquiries are automatically routed to the appropriate department
                            based on predefined categories and keywords. Save time and avoid
                            the hassle of manual routing, ensuring faster resolution times.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-8 bg-pink-500 text-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <h2 className="text-4xl font-bold mb-4">AI-Powered Chatbot</h2>
                        <p className="text-lg">
                            Let the AI-powered chatbot handle common inquiries instantly, giving
                            students the assistance they need 24/7. For complex questions,
                            inquiries are escalated to human staff.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Section 3: Feature Highlights */}
            <div className="container mx-auto px-6 lg:px-8 mt-10 mb-10">
                <h2 className="text-5xl font-bold text-center text-slate-800 mb-12">Feature Highlights</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <motion.div
                        className="bg-red-400 text-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-3xl font-bold">Response Tracking</h3>
                        <p className="mt-4">
                            Keep track of all inquiries and responses in real-time. View the
                            status of every inquiry and ensure timely resolutions.
                        </p>
                    </motion.div>
                    <motion.div
                        className="bg-teal-400 text-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-3xl font-bold">Analytics & Reporting</h3>
                        <p className="mt-4">
                            Get in-depth analytics on inquiry categories, response times, and
                            department performance. Generate reports to improve services and
                            identify trends.
                        </p>
                    </motion.div>
                    <motion.div
                        className="bg-gray-400 text-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-3xl font-bold">Secure Data Handling</h3>
                        <p className="mt-4">
                            Ensure that student information is securely encrypted and handled
                            with full compliance to data protection regulations.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Call to Action */}
            <motion.div
                className="bg-indigo-300 text-white p-12 rounded-lg shadow-xl text-center mx-6 mb-20 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-4xl font-bold">
                    Ready to Transform Your Institutions Inquiry Management?
                </h2>
                <p className="mt-4 text-lg">
                    Get started today and streamline your communication process with students.
                </p>
                <Link href="/contact">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(13, 110, 253, 1)" }}
                        className="mt-6 bg-teal-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
                    >
                        Get Started
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
