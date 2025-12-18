import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface SidebarProps {
  pathname: string;
  collapsed: boolean;
}

const Sidebar = ({ pathname, collapsed }: SidebarProps) => {
  const menuLists = [
    {
      id: 1,
      href: "/dashboard",
      icon: "hugeicons:dashboard-square-01",
      label: "Dashboard",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      id: 2,
      href: "/dashboard/category",
      icon: "clarity:shopping-bag-line",
      label: "Categories",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    // {
    //   id: 3,
    //   href: "/dashboard/technology",
    //   icon: "solar:cpu-bolt-linear",
    //   label: "Technology",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    {
      id: 3,
      href: "/dashboard/team-members",
      icon: "solar:users-group-rounded-linear",
      label: "Our Team",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    // {
    //   id: 5,
    //   href: "/dashboard/certificate",
    //   icon: "ph:suitcase-simple-light",
    //   label: "Career",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    // {
    //   id: 6,
    //   href: "/dashboard/bookings",
    //   icon: "hugeicons:message-multiple-02",
    //   label: `Inquiries`,
    // },
    {
      id: 4,
      href: "/dashboard/blogs",
      icon: "streamline-ultimate:pen-write",
      label: "Blogs",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      id: 5,
      href: "/dashboard/useful-info",
      icon: "bi:question-square",
      label: "FAQ's",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      id: 6,
      href: "/dashboard/ads",
      icon: "bi:badge-ad",
      label: "Advertisements",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      id: 7,
      href: "/dashboard/user-management",
      icon: "teenyicons:user-circle-outline",
      label: "User Management",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      id: 8,
      href: "/dashboard/newsletter",
      icon: "heroicons:newspaper",
      label: "Newsletter",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    // {
    //   id: 9,
    //   href: "/dashboard/gallery",
    //   icon: "solar:gallery-bold",
    //   label: "Home Gallery",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    {
      id: 10,
      href: "/dashboard/inbox",
      icon: "streamline-plump:contact-phonebook",
      label: `Inbox`,
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
  ];
  return (
    <div
      className={cn(
        "fixed h-screen  border-r  border-gray-200  transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b px-4 transition-all duration-300",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src={collapsed ? "/logo/favicon.png" : "/logo/logo.png"}
            alt="shyam's sweets logo"
            className={cn(" ", collapsed ? "w-10 h-auto" : "w-24 h-auto")}
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-1 px-2 h-dvh flex flex-col justify-between">
        <nav className="space-y-1">
          {menuLists.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.id}
                to={menu.href}
                className={cn(
                  "flex items-center justify-between rounded-xs relative px-3 py-1.5 text-sm transition-colors duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-zinc-900 hover:bg-primary/10 hover:text-primary",
                  collapsed && "justify-center px-2",
                  !collapsed && "  gap-3"
                )}
              >
                <div className="flex  items-center">
                  <Icon
                    icon={menu.icon}
                    className="w-5 h-5 transition-transform text-primary duration-200 group-hover:scale-110"
                  />
                  {!collapsed && (
                    <span className="ml-3 truncate">{menu.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="text-xs flex items-center justify-center gap-2 border-t pt-2">
          {!collapsed ? (
            <span className="text-zinc-500">Design & Developed by</span>
          ) : null}
          <a href="https://webxnep.com/" target="_blank">
            <img src="/logo/webx-logo.jpg" alt="WebX Logo" className="h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
