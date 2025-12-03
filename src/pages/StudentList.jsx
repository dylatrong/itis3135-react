import React, { useState, useEffect } from 'react';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // New state to track which student card is currently expanded (by prefix)
    const [expandedPrefix, setExpandedPrefix] = useState(null);

    useEffect(() => {
        fetch('https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (Status: ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    console.error("API Error: Data is not an array", data);
                    setError("Received invalid data format from server.");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Helper to properly extract the name from the object
    const getStudentName = (student) => {
        if (!student || !student.name) return "Anonymous";
        
        // If it's the object format: { first: "Name", last: "..." }
        if (typeof student.name === 'object') {
            const first = student.name.first || "";
            const last = student.name.last || "";
            return `${first} ${last}`.trim() || "Anonymous";
        }
        
        // Fallback if it happens to be a string
        return String(student.name);
    };

    const toggleExpand = (prefix) => {
        // Toggle: if clicking the same one, close it (null). Otherwise, open the new one.
        setExpandedPrefix(expandedPrefix === prefix ? null : prefix);
    };

    const filteredStudents = students.filter(student => {
        if (!student) return false;
        
        const term = searchTerm.toLowerCase();
        const nameStr = getStudentName(student).toLowerCase();
        // The API uses "personalStatement" for the bio
        const bioStr = (student.personalStatement || "").toLowerCase();
        
        return nameStr.includes(term) || bioStr.includes(term);
    });

    if (error) {
        return (
            <main style={{ padding: "20px", color: "red" }}>
                <h2>Error Loading Students</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </main>
        );
    }

    return (
        <main>
            <h2>Student Introductions</h2>
            <p>Classmates from ITIS 3135. Click on a student to see more details.</p>

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
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => {
                            if (!student) return null;
                            const isExpanded = expandedPrefix === student.prefix;
                            
                            return (
                                <div 
                                    key={index} 
                                    className="student-card"
                                    onClick={() => toggleExpand(student.prefix)}
                                    style={{ cursor: 'pointer' }} // Show it's clickable
                                >
                                    {/* IMAGE SECTION */}
                                    {student.media && student.media.src && (
                                        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                            <img 
                                                src={`https://dvonb.xyz${student.media.src}`} 
                                                alt={`${getStudentName(student)}`}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '200px',
                                                    borderRadius: '4px',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none'; // Hide if image fails
                                                }}
                                            />
                                            {student.media.caption && (
                                                <p style={{ fontSize: '0.8em', color: '#8b949e', fontStyle: 'italic' }}>
                                                    {student.media.caption}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <h3 style={{ color: '#58a6ff', marginTop: 0 }}>
                                        {getStudentName(student)}
                                    </h3>
                                    
                                    {/* MASCOT */}
                                    {student.mascot && (
                                        <p style={{ color: '#79c0ff', fontSize: '0.9em' }}>
                                            <strong>Mascot:</strong> {student.mascot}
                                        </p>
                                    )}

                                    {/* INTRODUCTION (Teaser or Full) */}
                                    <p>
                                        {student.personalStatement || "No introduction provided."}
                                    </p>

                                    {/* EXPANDED CONTENT */}
                                    {isExpanded && (
                                        <div style={{ 
                                            marginTop: '15px', 
                                            paddingTop: '15px', 
                                            borderTop: '1px solid #30363d',
                                            animation: 'fadeIn 0.3s' 
                                        }}>
                                            {/* Quote */}
                                            {student.quote && (student.quote.text || student.quote.author) && (
                                                <blockquote style={{ 
                                                    borderLeft: '3px solid #58a6ff', 
                                                    margin: '10px 0', 
                                                    paddingLeft: '10px', 
                                                    fontStyle: 'italic',
                                                    color: '#c9d1d9'
                                                }}>
                                                    "{student.quote.text}" 
                                                    {student.quote.author && <span style={{ display: 'block', fontSize: '0.8em', marginTop: '5px' }}>— {student.quote.author}</span>}
                                                </blockquote>
                                            )}

                                            {/* Fun Fact */}
                                            {student.funFact && (
                                                <p><strong>Fun Fact:</strong> {student.funFact}</p>
                                            )}

                                            {/* Backgrounds */}
                                            {student.backgrounds && (
                                                <div style={{ fontSize: '0.9em', color: '#8b949e', marginTop: '10px' }}>
                                                    {student.backgrounds.academic && <p><strong>Academic:</strong> {student.backgrounds.academic}</p>}
                                                    {student.backgrounds.professional && <p><strong>Professional:</strong> {student.backgrounds.professional}</p>}
                                                </div>
                                            )}

                                            {/* Links */}
                                            {student.links && Object.keys(student.links).length > 0 && (
                                                <div style={{ marginTop: '15px' }}>
                                                    <strong>Links:</strong><br/>
                                                    {Object.entries(student.links).map(([key, url]) => (
                                                        url ? (
                                                            <a 
                                                                key={key} 
                                                                href={url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                style={{ 
                                                                    display: 'inline-block', 
                                                                    marginRight: '10px', 
                                                                    color: '#58a6ff',
                                                                    textTransform: 'capitalize' 
                                                                }}
                                                                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                                                            >
                                                                {key}
                                                            </a>
                                                        ) : null
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* CLICK INDICATOR */}
                                    <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.8em', color: '#58a6ff' }}>
                                        {isExpanded ? "Show Less ▲" : "Show More ▼"}
                                    </div>

                                    {/* DATE */}
                                    {student.acknowledgementDate && (
                                        <small style={{ color: '#8b949e', display: 'block', marginTop: '10px' }}>
                                            Submitted: {student.acknowledgementDate}
                                        </small>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No students found matching "{searchTerm}".</p>
                    )}
                </div>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}

export default StudentList;