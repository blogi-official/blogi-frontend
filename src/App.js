import React from "react";
import Navigator from './components/Navigation';
import Footer from './components/Footer';
import Router from './routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigator />
      <main>
        <Router />
      </main>
      <Footer />
    </div>
  );
}

export default App;
