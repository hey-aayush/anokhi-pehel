import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, SERVER_URL } from "../Service/helper";

const StudentProfileModal = ({ student, isOpen, onClose }) => {
    const [studentData, setStudentData] = useState(null); // Holds student data fetched from API
    const [marks, setMarks] = useState([]);

    useEffect(() => {
        if (isOpen && student?._id) {
            // Fetch student details
            axios
                .get(`${BASE_URL}/getstudentByUserId?studentid=${student._id}`)
                .then((res) => {
                    setStudentData(res.data); // Set the student data fetched from the API
                })
                .catch((err) => {
                    console.error("Error fetching student details: ", err);
                });

            // Fetch marks
            axios
                .get(`${BASE_URL}/getMarksByUserId?studentid=${student._id}`)
                .then((res) => {
                    setMarks(res.data); // Set marks data fetched from the API
                })
                .catch((err) => {
                    console.error("Error fetching marks: ", err);
                });
        }
    }, [isOpen, student]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                <button className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900" onClick={onClose}>
                    &times;
                </button>
                {studentData ? (
                    <div className="flex flex-col md:flex-row md:space-x-8 justify-center items-start">
                        <div className="flex-shrink-0">
                            <img
                                src={`${SERVER_URL}/images/${studentData.photo}`}
                                className="mentor-photo h-32 w-32 rounded-full object-cover border-2 border-gray-300"
                                alt="Student"
                            />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg w-full">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{studentData.name}</h3>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Location:</span>{" "}
                                <span className="text-blue-600">{studentData.location}</span>
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Mode:</span>{" "}
                                <span className="text-blue-600">{studentData.mode}</span>
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Phone:</span>{" "}
                                <span className="text-blue-600">{studentData.phone}</span>
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">School:</span>{" "}
                                <span className="text-blue-600">{studentData.school}</span>
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Class:</span>{" "}
                                <span className="text-blue-600">{studentData.className}</span>
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Address:</span>{" "}
                                <span className="text-blue-600">{studentData.address}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-600">No student data available.</p>
                )}

                {/* Marks Record Section */}
                <div className="mt-8">
                    <h2 className="schedule-title text-xl font-bold text-center mb-4">
                        Marks Record
                    </h2>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse border border-gray-500">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Subject</th>
                                        <th className="px-4 py-2">Marks %</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {marks && marks.length > 0 ? (
                                        marks.map((mark, index) => {
                                            const studentMarks = mark.score.find(
                                                (score) => score.studentId === student._id
                                            );

                                            if (studentMarks) {
                                                const date = new Date(mark.date).toLocaleDateString();

                                                return (
                                                    <tr key={index} className="hover:bg-gray-200 transition-colors duration-200">
                                                        <td className="border px-4 py-2">{date}</td>
                                                        <td className="border px-4 py-2">{mark.subject}</td>
                                                        <td className="border px-4 py-2">
                                                            {studentMarks.score}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="border px-4 py-2">
                                                No Marks Record found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileModal;
