import React, { useState, useEffect, useMemo } from 'react';

// Define the initial state for the filtering checkboxes
const initialFilterCriteria = {
    name: true,
    mascot: true,
    image: true,
    personalStatement: true,
    backgrounds: true,
    classes: true, // Now controls display of the 'courses' array
    extraInfo: true, // Computer, Fun Fact, etc.
    quote: true,
    links: true,
};

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [filterCriteria, setFilterCriteria] = useState(initialFilterCriteria);

    useEffect(() => {
        // Fetches data from the API
        fetch('https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (Status: ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setStudents(data.filter(s => s && s.name)); // Filter out null/bad entries
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
        
        if (typeof student.name === 'object') {
            const first = student.name.first || "";
            const last = student.name.last || "";
            return `${first} ${last}`.trim() || "Anonymous";
        }
        
        return String(student.name);
    };

    // Filters students based on the search term (memoized for performance)
    const visibleStudents = useMemo(() => {
        const term = searchTerm.toLowerCase();
        
        const filtered = students.filter(student => {
            if (!student) return false;
            
            const nameStr = getStudentName(student).toLowerCase();
            // Search by name (first/last)
            return nameStr.includes(term);
        });

        // Reset the index if the filtered list changes
        if (filtered.length > 0 && currentStudentIndex >= filtered.length) {
            setCurrentStudentIndex(0);
        } else if (filtered.length === 0) {
            setCurrentStudentIndex(0);
        }

        return filtered;
    }, [students, searchTerm]);


    // Handlers for the slideshow navigation
    const handleNext = () => {
        setCurrentStudentIndex((prevIndex) => 
            (prevIndex + 1) % visibleStudents.length
        );
    };

    const handlePrev = () => {
        setCurrentStudentIndex((prevIndex) => 
            (prevIndex - 1 + visibleStudents.length) % visibleStudents.length
        );
    };

    // Handler for checkbox changes
    const handleFilterChange = (criteriaKey) => {
        setFilterCriteria(prevCriteria => ({
            ...prevCriteria,
            [criteriaKey]: !prevCriteria[criteriaKey],
        }));
    };

    // Display error state
    if (error) {
        return (
            <main style={{ padding: "20px", color: "red", backgroundColor: '#0d1117' }}>
                <h2>Error Loading Students</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </main>
        );
    }
    
    // Display loading state
    if (loading) {
        return (
            <main style={{ padding: "20px", backgroundColor: '#0d1117', color: '#c9d1d9' }}>
                <p>Loading student data...</p>
            </main>
        );
    }

    // Get the student object currently displayed in the slideshow
    const currentStudent = visibleStudents[currentStudentIndex];
    const studentCount = visibleStudents.length;


    return (
        <main style={{ padding: "20px", backgroundColor: '#0d1117', color: '#c9d1d9', minHeight: '100vh' }}>
            <h2 style={{ color: '#58a6ff' }}>Student Introductions Slideshow 🎓</h2>

            {/* --- COUNTER & SEARCH --- */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #30363d', borderRadius: '5px' }}>
                <h3 style={{ marginTop: 0, color: '#79c0ff' }}>Search & Count</h3>
                
                {/* COUNTER */}
                <p>
                    **Students Found:** **{studentCount}**
                    {studentCount > 0 && (
                        <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#8b949e' }}>
                            (Showing {currentStudentIndex + 1} of {studentCount})
                        </span>
                    )}
                </p>

                {/* SEARCH INPUT */}
                <input 
                    type="text" 
                    placeholder="Search students by name (first or last)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '5px',
                        border: '1px solid #58a6ff',
                        backgroundColor: '#0d1117',
                        color: '#c9d1d9'
                    }}
                />
            </div>
            
            {/* --- CHECKBOX FILTER CONTROLS --- */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #30363d', borderRadius: '5px' }}>
                <h3 style={{ marginTop: 0, color: '#79c0ff' }}>Display Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {Object.keys(initialFilterCriteria).map(key => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={filterCriteria[key]}
                                onChange={() => handleFilterChange(key)}
                                style={{ marginRight: '5px' }}
                            />
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                    ))}
                </div>
            </div>

            {/* --- SLIDESHOW DISPLAY --- */}
            <div className="slideshow-container" style={{ textAlign: 'center' }}>
                {studentCount > 0 ? (
                    <div className="student-card" style={{ 
                        border: '1px solid #58a6ff', 
                        padding: '20px', 
                        borderRadius: '8px', 
                        margin: '20px auto',
                        maxWidth: '600px',
                        textAlign: 'left',
                        backgroundColor: '#161b22',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
                    }}>
                        
                        {/* NAME */}
                        {filterCriteria.name && (
                            <h3 style={{ color: '#58a6ff', marginTop: 0, textAlign: 'center' }}>
                                {getStudentName(currentStudent)}
                            </h3>
                        )}

                        {/* IMAGE */}
                        {filterCriteria.image && currentStudent.media && currentStudent.media.src && (
                            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                <img 
                                    src={`https://dvonb.xyz${currentStudent.media.src}`} 
                                    alt={`${getStudentName(currentStudent)}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '250px',
                                        borderRadius: '4px',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                {currentStudent.media.caption && (
                                    <p style={{ fontSize: '0.8em', color: '#8b949e', fontStyle: 'italic' }}>
                                        {currentStudent.media.caption}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* MASCOT */}
                        {filterCriteria.mascot && currentStudent.mascot && (
                            <p style={{ color: '#79c0ff', fontSize: '0.9em' }}>
                                <strong>Mascot:</strong> {currentStudent.mascot}
                            </p>
                        )}
                        
                        {/* PERSONAL STATEMENT */}
                        {filterCriteria.personalStatement && (
                            <div>
                                <p style={{ fontWeight: 'bold' }}>Personal Statement:</p>
                                <p style={{ paddingLeft: '10px' }}>
                                    {currentStudent.personalStatement || "No personal statement provided."}
                                </p>
                            </div>
                        )}
                        
                        {/* BACKGROUNDS */}
                        {filterCriteria.backgrounds && currentStudent.backgrounds && (
                            <div style={{ fontSize: '0.9em', color: '#c9d1d9', marginTop: '10px', borderLeft: '3px solid #79c0ff', paddingLeft: '10px' }}>
                                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Backgrounds:</p>
                                {currentStudent.backgrounds.academic && <p style={{ margin: 0 }}><strong>Academic:</strong> {currentStudent.backgrounds.academic}</p>}
                                {currentStudent.backgrounds.professional && <p style={{ margin: 0 }}><strong>Professional:</strong> {currentStudent.backgrounds.professional}</p>}
                            </div>
                        )}
                        
                        {/* CLASSES (Using the 'courses' array from the API) */}
                        {filterCriteria.classes && currentStudent.courses && currentStudent.courses.length > 0 && (
                            <div style={{ marginTop: '15px', borderLeft: '3px solid #f08080', paddingLeft: '10px' }}>
                                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Courses Enrolled:</p>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                                    {currentStudent.courses.map((course, index) => (
                                        <li key={index} style={{ marginBottom: '5px' }}>
                                            **{course.code || `${course.dept} ${course.num}`}**: {course.name}
                                            {course.reason && (
                                                <span style={{ display: 'block', fontSize: '0.8em', color: '#8b949e', fontStyle: 'italic' }}>
                                                    (Reason: {course.reason})
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* Fallback for Classes/Courses */}
                        {filterCriteria.classes && (!currentStudent.courses || currentStudent.courses.length === 0) && (
                            <div style={{ marginTop: '15px', borderLeft: '3px solid #f08080', paddingLeft: '10px' }}>
                                <p style={{ fontStyle: 'italic', color: '#8b949e' }}>
                                    No specific course list was provided by this student.
                                </p>
                            </div>
                        )}
                        
                        {/* QUOTE */}
                        {filterCriteria.quote && currentStudent.quote && (currentStudent.quote.text || currentStudent.quote.author) && (
                            <blockquote style={{ 
                                borderLeft: '3px solid #58a6ff', 
                                margin: '15px 0', 
                                paddingLeft: '10px', 
                                fontStyle: 'italic',
                                color: '#c9d1d9'
                            }}>
                                "{currentStudent.quote.text || "No quote text."}" 
                                {currentStudent.quote.author && <span style={{ display: 'block', fontSize: '0.8em', marginTop: '5px' }}>— {currentStudent.quote.author}</span>}
                            </blockquote>
                        )}

                        {/* EXTRA INFO (Fun Fact is the main one available) */}
                        {filterCriteria.extraInfo && currentStudent.funFact && (
                            <p style={{ marginTop: '15px' }}>
                                <strong>Fun Fact:</strong> {currentStudent.funFact}
                            </p>
                        )}
                        
                        {/* LINKS */}
                        {filterCriteria.links && currentStudent.links && Object.keys(currentStudent.links).length > 0 && (
                            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #30363d' }}>
                                <strong>Links:</strong><br/>
                                {Object.entries(currentStudent.links).map(([key, url]) => (
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
                                        >
                                            {key}
                                        </a>
                                    ) : null
                                ))}
                            </div>
                        )}

                    </div>
                ) : (
                    <p>No students found matching your search criteria.</p>
                )}

                {/* SLIDESHOW NAVIGATION BUTTONS */}
                <div className="slideshow-buttons" style={{ marginTop: '20px' }}>
                    <button 
                        onClick={handlePrev} 
                        disabled={studentCount <= 1}
                        style={{ ...buttonStyle, marginRight: '10px' }}
                    >
                        &lt; Previous
                    </button>
                    <button 
                        onClick={handleNext} 
                        disabled={studentCount <= 1}
                        style={buttonStyle}
                    >
                        Next &gt;
                    </button>
                </div>
            </div>
        </main>
    );
}

// Basic style for the navigation buttons
const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#238636',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
};

export default StudentList;