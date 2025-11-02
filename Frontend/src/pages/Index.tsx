import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, User } from "@/lib/api";
import { VerticalNav } from "@/components/VerticalNav";
import { StatCard } from "@/components/StatCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { HeatmapCard } from "@/components/HeatmapCard";
import { InsightsCard } from "@/components/InsightsCard";
import { EmptyDashboard } from "@/components/EmptyDashboard";
import { Trophy, Target, Zap, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasConnectedGame, setHasConnectedGame] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      if (!apiClient.isAuthenticated()) {
        navigate("/auth");
        return;
      }

      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to get user:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show empty dashboard if no game is connected
  if (!hasConnectedGame) {
    const userName = user?.name?.split(" ")[0] || "Player";
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <VerticalNav />
        </div>
        
        <div className="lg:ml-20 px-4 py-6">
          <EmptyDashboard 
            userName={userName}
            onGameConnect={() => setHasConnectedGame(true)}
          />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="flex justify-around items-center py-2">
            <button 
              onClick={() => navigate("/")}
              className="flex flex-col items-center p-3 text-primary"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center p-3 text-muted-foreground"
            >
              <Target className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
        
        <div className="lg:hidden h-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <VerticalNav />
      </div>
      
      {/* Main content with responsive margins */}
      <main className="lg:ml-20 px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Player"}!
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Here's your performance summary for this week
          </p>
        </div>

        {/* Key Metrics - Responsive grid */}
        <div className="mb-6 lg:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <StatCard 
            title="Win Rate" 
            value="68%" 
            subtitle="Last 20 games" 
            icon={Trophy} 
            trend={{ value: 5, isPositive: true }} 
            variant="success" 
          />
          <StatCard 
            title="Accuracy" 
            value="76%" 
            subtitle="Avg. hit rate" 
            icon={Target} 
            trend={{ value: 12, isPositive: true }} 
            variant="default" 
          />
          <StatCard 
            title="Reaction Time" 
            value="245ms" 
            subtitle="Average response" 
            icon={Zap} 
            trend={{ value: -8, isPositive: true }} 
            variant="warning" 
          />
          <StatCard 
            title="Consistency" 
            value="8.4" 
            subtitle="Out of 10" 
            icon={TrendingUp} 
            trend={{ value: 3, isPositive: true }} 
            variant="success" 
          />
        </div>

        {/* Charts and Analysis - Stack on mobile, side by side on desktop */}
        <div className="mb-6 lg:mb-8 grid gap-4 lg:gap-6 lg:grid-cols-2">
          <PerformanceChart />
          <HeatmapCard />
        </div>

        {/* Insights */}
        <InsightsCard />
      </main>

      {/* Mobile Navigation - Fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center py-2">
          <button 
            onClick={() => navigate("/")}
            className="flex flex-col items-center p-3 text-primary"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center p-3 text-muted-foreground"
          >
            <Target className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      {/* Add padding bottom for mobile navigation */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
};
export default Index;