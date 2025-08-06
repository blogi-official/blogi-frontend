import React from 'react';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';

function Home() {
  return (
    <>
      <header className="py-5 bg-light border-bottom mb-4">
        <div className="container">
          <div className="text-center my-5">
            <h1 className="fw-bolder">Welcome to Blogi Home!</h1>
            <p className="lead mb-0">A Bootstrap 5 starter layout for your next blog homepage</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-lg-6"><BlogCard /></div>
              <div className="col-lg-6"><BlogCard /></div>
              <div className="col-lg-6"><BlogCard /></div>
              <div className="col-lg-6"><BlogCard /></div>
            </div>
          </div>

          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;