import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Contract from './pages/Contract';
import StudentList from './pages/StudentList';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/contract" element={<Contract />} />
        {/* Optional: Add a catch-all for 404 pages */}
        {/* <Route path="*" element={<h2>404 Not Found</h2>} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;