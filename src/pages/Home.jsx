/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function Home() {
    const topics = [
        { name: "Subjects", color: "blue" },
        { name: "Hostel", color: "green" },
        { name: "Exams", color: "purple" },
        { name: "Tech Help", color: "gray" },
        { name: "Clubs", color: "orange" },
        { name: "Canteen", color: "pink" },
    ];

    const allQuestions = [
        {
            "question": "Where can I find previous year question papers?",
            "answer": "Check the university library's digital archive or request them from your department."
        },
        {
            "question": "Is medical leave accepted for attendance?",
            "answer": "Yes, with proper documents submitted to the department within the provided time period."
        },
        {
            "question": "What are the hostel rules?",
            "answer": "Hostels close at 11 PM. You must return to the hostel before that time."
        },
        {
            "question": "What time does the canteen and campus close?",
            "answer": "The campus main gate closes at 9 PM, and the canteen also closes around the same time. Make sure to enter the campus before 9 PM."
        },
        {
            "question": "How do I contact my academic advisor?",
            "answer": "You can find your advisor's details on the academic portal under the 'My Profile' section."
        },
        {
            "question": "What is the dress code for lab sessions?",
            "answer": "Wearing a lab coat and closed shoes is mandatory. Loose clothing and accessories are not allowed."
        }
    ]


    const dummyAnnouncements = [
        {
            title: "Campus WiFi Upgrade",
            description:
                "The campus WiFi will be upgraded on 25th July. Expect brief outages from 2 AM to 6 AM.",
        },
        {
            title: "Sports Meet",
            description:
                "Join us for the annual sports meet starting August 1st. Register your teams at the sports office.",
        },
        {
            title: "Library Extended Hours",
            description:
                "The library will remain open until midnight during exam weeks to support students.",
        },
    ];

    const [showAll, setShowAll] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
    const [errorAnnouncements, setErrorAnnouncements] = useState(null);

    const visibleQuestions = showAll ? allQuestions : allQuestions.slice(0, 4);

    useEffect(() => {
        async function fetchData() {
            setLoadingAnnouncements(true);
            setErrorAnnouncements(null);

            try {
                // Get token from localStorage
                const token = localStorage.getItem("authToken");

                // Then fetch announcements with Authorization header
                const announcementsResponse = await fetch(
                    "https://helpdesk-production-c4f9.up.railway.app/api/announcements",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!announcementsResponse.ok) {
                    throw new Error(`Failed to fetch announcements. Status: ${announcementsResponse.status}`);
                }

                const announcementsData = await announcementsResponse.json();
                setAnnouncements(announcementsData);
            } catch (error) {
                setErrorAnnouncements(error.message);
            } finally {
                setLoadingAnnouncements(false);
            }

        }

        fetchData();
    }, []);


    return (
        <>
            <Header />
            <div className="max-w-6xl mx-auto p-8 space-y-20 py-29">
                {/* Welcome */}
                <section className="text-center">
                    <h1 className="text-4xl font-extrabold mb-4 tracking-wide">👋 Welcome to Help Desk!</h1>
                    <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
                        A friendly platform where juniors can ask questions and seniors provide guidance all to
                        make your campus life easier and more connected.
                    </p>
                </section>

                {/* Main Actions */}
                <section className="flex flex-wrap justify-center gap-6">
                    <Link to="/ask-question">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-md hover:scale-105 transform transition">
                            ❓ Ask a Question
                        </button>
                    </Link>
                    <Link to="/all-questions">
                        <button className="flex items-center gap-2 bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition shadow-sm hover:shadow-md">
                            🔍 Browse Questions
                        </button>
                    </Link>
                </section>

                {/* Tip of the Day */}
                <section className="p-6 bg-yellow-50 border-l-8 border-yellow-400 rounded shadow-md max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-yellow-700">💡 Tip of the Day</h2>
                    <p className="text-gray-700">
                        Be specific when asking questions and tag relevant topics. Clear questions get faster and
                        better answers!
                    </p>
                </section>

                {/* Featured Topics */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">📚 Featured Topics</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {topics.map((topic) => (
                            <span
                                key={topic.name}
                                className={`cursor-pointer rounded-full px-5 py-2 font-semibold bg-${topic.color}-100 text-${topic.color}-700 hover:bg-${topic.color}-200 shadow-sm hover:shadow-md select-none`}
                            >
                                {topic.name}
                            </span>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section className="space-y-10">
                    <h2 className="text-3xl font-bold text-center">How It Works</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { title: "Ask", desc: "Choose a topic and post your question anonymously or by name.", color: "bg-indigo-50" },
                            { title: "Get Help", desc: "Peers and seniors answer and vote on helpful responses.", color: "bg-green-50" },
                            { title: "Learn", desc: "Learn from real life questions and grow your knowledge.", color: "bg-yellow-50" },
                        ].map((step, idx) => (
                            <div key={idx} className={`${step.color} p-6 rounded-2xl shadow hover:shadow-md`}>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Success Stories */}
                <section className="bg-green-50 p-8 rounded-lg max-w-5xl mx-auto text-center shadow-md">
                    <h2 className="text-3xl font-semibold mb-6 text-green-700">🌟 Real Success Stories</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Avishka", story: "I got quick help with my hostel setup. This platform is a lifesaver!" },
                            { name: "Promoda", story: "Thanks , I passed my difficult exam. Huge thanks!" },
                            { name: "Madusanka", story: "Got answers to all my subject doubts within hours. Amazing support!" },
                        ].map((user, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow hover:shadow-lg">
                                <p className="italic text-gray-600 mb-2">"{user.story}"</p>
                                <p className="text-sm font-semibold text-gray-800">– {user.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Explore Clubs */}
                <section className="bg-indigo-50 p-8 rounded-lg max-w-5xl mx-auto text-center shadow-md">
                    <h2 className="text-3xl font-semibold mb-6 text-indigo-700">🏫 Explore Clubs & Events</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-indigo-800">🌍 Zero Plastic Club</h3>
                            <p className="text-gray-600 text-sm">
                                Promote plastic free living through awareness campaigns and eco-friendly initiatives.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-indigo-800">💻 ICTSC (ICT Students’ Club)</h3>
                            <p className="text-gray-600 text-sm">
                                Tech talks, workshops, and networking events to boost your ICT skills and connections.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-indigo-800">🏅 Sports Club</h3>
                            <p className="text-gray-600 text-sm">
                                Participate in tournaments, fitness sessions, and team building sports activities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Announcements */}
                <section className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-red-400">
                        📢 Latest Announcements
                    </h2>

                    {loadingAnnouncements && (
                        <p className="text-center text-gray-500 italic">Loading announcements...</p>
                    )}

                    {/* {errorAnnouncements && (
                        <p className="text-center text-red-600 font-semibold mb-4">
                            Failed to load announcements, showing latest available.
                        </p>
                    )} */}

                    {!loadingAnnouncements && (
                        <div className="space-y-8">
                            {(announcements.length > 0 ? announcements : dummyAnnouncements).map(
                                (announcement, i) => {
                                    const title = announcement.title || `Announcement #${i + 1}`;
                                    const description =
                                        announcement.description || announcement.content || "";

                                    return (
                                        <div
                                            key={i}
                                            className="bg-purple-50 p-6 rounded-3xl shadow-md border border-purple-200 transform transition-transform duration-300 ease-in-out hover:scale-105"
                                            title={title}
                                        >
                                            <h3 className="text-2xl font-semibold text-purple-900 mb-3 truncate">{title}</h3>
                                            <p className="text-purple-700 leading-relaxed whitespace-pre-line truncate">
                                                {description}
                                            </p>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* Recently Asked Questions & Answers */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-blue-700">🆕 Recently Asked Questions</h2>
                    <ul className="space-y-6 max-w-3xl mx-auto">
                        {visibleQuestions.map((qa, index) => (
                            <li
                                key={index}
                                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition border border-blue-100 cursor-pointer"
                                onClick={() => setExpanded(expanded === index ? null : index)}
                            >
                                <p className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                                    ❓ {qa.question}
                                    <span>{expanded === index ? "−" : "+"}</span>
                                </p>
                                {expanded === index && <p className="text-gray-700 mt-2">💬 {qa.answer}</p>}
                            </li>
                        ))}
                    </ul>
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-blue-600 underline hover:text-blue-800 transition"
                        >
                            {showAll ? "Show Less" : "See More Questions"}
                        </button>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-10 text-center shadow-lg max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Ready to help or need help?</h2>
                    <p className="text-lg mb-6 max-w-xl mx-auto">
                        Join the Peer Help Desk community and start asking or answering questions today!
                    </p>
                    <Link to="/">
                        <button className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition">
                            Get Started
                        </button>
                    </Link>
                </section>

                {/* Footer */}
                <footer className="text-center text-gray-500 text-sm mt-20 border-t border-gray-300 pt-6 select-none trun">
                    © 2025 Help Desk — Helping juniors succeed!
                </footer>
            </div>
        </>
    );
}

export default Home;
