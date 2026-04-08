// src/layouts/SidebarLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/Shared/SideBar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main
        className={`flex-1 relative transition-all duration-300 ease-in-out
          ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}`}
      >
        {/* Contenedor principal de tus vistas */}
        <div className="p-4 md:p-6 mt-12 md:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;