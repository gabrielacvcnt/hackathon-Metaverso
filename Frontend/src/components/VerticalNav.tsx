import { User, BarChart3, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const VerticalNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiClient.logout();
    navigate("/auth");
  };

  return (
    <TooltipProvider>
      <nav className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center border-r border-border bg-card py-6">
        {/* Logo */}
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-xl font-bold">LSX</span>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-1 flex-col items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/profile">
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/">
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                )}
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Dashboard</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Logout Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 transition-all hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
};
