// src/components/Common/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './../Dashboard/Sidebar'; 

const MainLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
