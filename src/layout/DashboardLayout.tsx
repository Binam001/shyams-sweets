import { useEffect, useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Navbar from "./dashboard/Navbar";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/userStore";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const router = useNavigate();
  const [isLogingOut, setIsLogingOut] = useState(false);
  const [access, setAccess] = useState(true);
  const { isAuthenticated } = useUserStore();

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLogingOut(true);
    localStorage.removeItem("accessToken");
    toast.success("You have been signed out successfully.");
    setIsLogingOut(false);
    router("/");
  };

  useEffect(() => {
    if (isAuthenticated) {
      setAccess(true);
    } else {
      setAccess(true);
      router("/");
    }
  }, [router]);

  return (
    <div>
      <Sidebar collapsed={sidebarCollapsed} pathname={pathname} />
      <div
        className={cn(" gap-0 transition-all duration-300 ease-in-out")}
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "15rem",
          width: sidebarCollapsed ? "calc(100% - 4rem)" : "calc(100% - 15rem)",
        }}
      >
        <Navbar
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isLogingOut={isLogingOut}
          handleLogout={handleLogout}
          pathname={pathname}
        />
        <main
          className={` p-6  overflow-auto  ${
            sidebarCollapsed ? "" : "max-w-7xl"
          }`}
        >
          <Outlet key={sidebarCollapsed ? "collapsed" : "expanded"} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
