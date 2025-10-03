import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Producto from './pages/Producto';

function App() {
    return (
        <div>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/producto/:id" element={<Producto/>} />
                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
