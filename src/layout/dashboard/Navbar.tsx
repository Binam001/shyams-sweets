import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";
import { categoryApi } from "@/apis/api-call";
import { useNavigate, useSearchParams } from "react-router-dom";

interface NavbarProps {
  pathname: string;
  // unreadCount: number;
  isLogingOut: boolean;
  handleLogout: () => Promise<void>;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const Navbar = ({
  isLogingOut,
  handleLogout,
  onToggleSidebar,
}: NavbarProps) => {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();

    // Check if we are already on the search page
    const isAlreadySearching = window.location.pathname.includes("/search");

    if (query) {
      router(`/dashboard/category/search?search=${encodeURIComponent(query)}`, {
        replace: isAlreadySearching,
      });
    }
  };
  return (
    <header className="h-16 my-auto border-b z-50 bg-background flex items-center px-6 sticky top-0 ">
      <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between relative">
        {/* Sidebar toggle (left) */}
        <div className="flex  items-center z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <Icon icon="material-symbols:menu-rounded" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>{" "}
          <form
            onSubmit={handleSearch}
            className="absolute left-12 w-full max-w-sm"
          >
            <div className="relative w-full">
              <Icon
                icon="iconoir:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-sm focus-visible:ring focus-visible:ring-primary/40 focus-visible:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </form>
        </div>

        {/* right side icon */}
        <div className="flex items-center gap-6 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full bg-zinc-50 hover:bg-zinc-50 cursor-pointer border hover:border-orange-500"
              >
                {/* <Bell className="h-5 w-5 text-zinc-400" /> */}
                <Icon icon="lucide:bell" />

                {
                  <Badge className="absolute animate-pulse text-white -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                    1
                  </Badge>
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-100 rounded-xl " align="end">
              <DropdownMenuItem className="cursor-pointer p-4">
                <div className="flex  gap-4 items-start py-">
                  <img src="/logo/webx.png" alt="WebX Nepal" className="h-16" />
                  <div className="flex flex-col">
                    <h3 className=" text-lg font-medium">
                      Message From Team WebX
                    </h3>
                    <div className="text-gray-500 text-xs mt-2">
                      Thank you from the bottom of our hearts your support means
                      the world to us and helps us grow together!
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserMenu isLogingOut={isLogingOut} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
