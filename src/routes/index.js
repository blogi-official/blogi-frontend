import React from 'react';
import { Routes, Route } from 'react-router-dom';
import blogRoutes from './blogRoutes';
import authRoutes from './authRoutes';
import aiRouter from './aiRoutes';

const allRoutes = [...blogRoutes, ...authRoutes, ...aiRouter];

function Router() {
  return (
    <Routes>
      {allRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
}

export default Router;