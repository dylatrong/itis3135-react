import React, { useState, useEffect } from 'react';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    // Optional: Add search state
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch data from the class API
        fetch('https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    // Filter students based on search term
    const filteredStudents = students.filter(student => 
        (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.intro && student.intro.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <main>
            <h2>Student Introductions</h2>
            <p>Classmates from ITIS 3135.</p>

            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Search for a student..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '5px',
                        border: '1px solid #30363d',
                        backgroundColor: '#0d1117',
                        color: '#c9d1d9'
                    }}
                />
            </div>

            {loading ? (
                <p>Loading student data...</p>
            ) : (
                <div className="student-grid">
                    {filteredStudents.map((student, index) => (
                        <div key={index} className="student-card">
                            {/* Display Name */}
                            <h3 style={{ color: '#58a6ff', marginTop: 0 }}>
                                {student.name || "Anonymous"}
                            </h3>
                            
                            {/* Display Introduction */}
                            <p>{student.intro || "No introduction provided."}</p>
                            
                            {/* Display Date (if available) */}
                            {student.date && (
                                <small style={{ color: '#8b949e' }}>Submitted: {student.date}</small>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default StudentList;