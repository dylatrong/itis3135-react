function Introduction() {
    document.title = "Introduction - ITIS 3135";
    return (
        <main>
            <h2>Introduction</h2>
            <figure>
                {/* You'll need to place your image in the `public/images` folder */}
                <img src="/images/headshot.jpg" alt="Headshot of Dylan Truong" style={{width: '200px'}} />
                <figcaption>Dylan J. Truong, in an AirBNB, Aug 2025</figcaption>
            </figure>

            <p>Hello! My name is Dylan Truong and I’m a 22 year old comp sci major at UNC Charlotte. My concentration is in Human Computer Interaction, and I have a passion for design and building things. I was born and raised in Upstate New York, and moved to North Carolina in 2017. Now, I call Monroe my home (And have been for about 8 years now!)</p>

            <ul>
                <li><strong>Personal Background:</strong> On top of what's mentioned above, I love making costumes and playing Doom.</li>
                <li><strong>Professional Background:</strong> I began my career with 3 years in Industrial Maintenance at Berry Global. This included electrical engineering and various technical skills at work. From that, I moved to Math Tutoring at a public School (UCPS) as my current job.</li>
                <li><strong>Academic Background:</strong> Currently in Computer Science, HCI concentration. I started in 2020 as an electrical/industrial apprentice and moved to my current degree in 2022. My highest level of education is an Associates Degree.</li>
                <li><strong>Primary Computer:</strong> ASUS TUF Dash F15 2021 (3060 ver.) running Windows 11 in my bedroom.</li>
                <li><strong>Courses I’m Taking, & Why:</strong>
                    <ul>
                        <li>ITIS-3135 - Front-End Web Application Development: Concentration Requirement.</li>
                        <li>ITIS-4180 - Mobile Application Development: Concentration Requirement.</li>
                        <li>ITIS-4358 - Physical Computing: Concentration Requirement.</li>
                        <li>ITIS-4353 - Social Technology Design: Concentration Requirement.</li>
                        <li>ITIS-3140 - User Experience Methods: Concentration Requirement.</li>
                    </ul>
                </li>
                <li><strong>Funny/Interesting Item to Remember Me by:</strong> If you google the UNC Charlotte campus police reports for Oct 30th, 2024, and search for “skateboard” you’ll see the entry where a campus officer found me after breaking my ankle skating at North Deck.</li>
                <li><strong>I’d Also Like to Share:</strong> Now I have a mended ankle. Don’t skate.</li>
            </ul>
            
            <blockquote>"There is no problem so severe that time cannot fix.”
                <cite>- The Orville (Show)</cite>
            </blockquote>
        </main>
    );
}

export default Introduction;