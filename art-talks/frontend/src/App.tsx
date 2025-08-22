import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalleryPage from './pages/GalleryPage';
import DiscussionPage from './pages/DiscussionPage';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/artwork/:id" element={<DiscussionPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;