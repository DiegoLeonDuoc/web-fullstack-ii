import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Carousel from './components/Carousel'
function App() {
  return (
    <div>
      <Header />
      <main>
        <Carousel />
      </main>
      <Footer />
    </div>
  );
}

export default App;
