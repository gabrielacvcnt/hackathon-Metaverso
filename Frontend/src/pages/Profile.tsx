import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, User } from "@/lib/api";
import { VerticalNav } from "@/components/VerticalNav";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { GameSelectionModal } from "@/components/GameSelectionModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useToast } from "@/hooks/use-toast";
import {
  Pencil,
  Plus,
  Trophy,
  Target,
  Users,
  Zap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [connectedGames, setConnectedGames] = useState<string[]>(["dota"]);
  const [isPro, setIsPro] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated and fetch user data
    const fetchUserData = async () => {
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

    fetchUserData();
  }, [navigate]);

  const handleImageUpdated = async (newImageUrl: string | null) => {
    // Refresh user data after image update
    try {
      const updatedUser = await apiClient.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const handleConnectGame = () => {
    if (connectedGames.length >= 1 && !isPro) {
      setShowUpgradeModal(true);
    } else {
      setShowGameModal(true);
    }
  };

  const handleGameConnect = (gameId: string) => {
    setConnectedGames([...connectedGames, gameId]);
    toast({
      title: "Game Connected!",
      description: `Successfully connected ${gameId.toUpperCase()}.`,
    });
  };

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

  const badges = [
    { name: "Farm Master", icon: Trophy, color: "text-amber-500" },
    { name: "Efficient Support", icon: Users, color: "text-blue-500" },
    { name: "Versatile Player", icon: Target, color: "text-purple-500" },
    { name: "Fast Evolution", icon: Zap, color: "text-green-500" },
  ];

  const positions = [
    { role: "Carry", level: 12, winRate: 52, progress: 60 },
    { role: "Mid", level: 8, winRate: 48, progress: 40 },
    { role: "Offlane", level: 15, winRate: 55, progress: 75 },
    { role: "Support", level: 18, winRate: 62, progress: 90 },
  ];

  const activities = [
    { title: "Reached Level 24", time: "2 days ago", icon: TrendingUp },
    { title: "Earned Farm Master badge", time: "1 week ago", icon: Trophy },
    { title: "Joined LSX Platform", time: "1 month ago", icon: CheckCircle2 },
  ];

  const weeklyGoals = [
    { goal: "Maintain 500+ GPM", progress: 75, completed: false },
    { goal: "5 Support Wins", progress: 60, completed: false },
    { goal: "Level Up Twice", progress: 50, completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <VerticalNav />
      </div>

      <main className="lg:ml-20 px-4 py-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-4 lg:space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="flex flex-col items-center pt-6 lg:pt-8">
              <ProfileImageUpload
                currentImageUrl={user?.preferences?.profile_url}
                userName={user?.name || "User"}
                onImageUpdated={handleImageUpdated}
              />
              <h1 className="mt-3 lg:mt-4 text-xl lg:text-3xl font-bold text-foreground">
                {user?.name || "Player"}
              </h1>
              <div className="mt-2 flex gap-2 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                <span>Level 24</span>
                <span>•</span>
                <span>#187 Ranking</span>
                <span>•</span>
                <span>58% Win Rate</span>
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout - Stack on mobile */}
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Connected Games */}
              <Card>
                <CardHeader>
                  <CardTitle>Connected Games</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border bg-accent/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="font-bold">D2</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">DOTA 2</h3>
                        <p className="text-sm text-muted-foreground">
                          Level 24 • 58% WR • 847 Matches
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleConnectGame}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Game
                  </Button>
                </CardContent>
              </Card>

              {/* Badges & Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className="group flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent"
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full bg-accent ${badge.color}`}
                        >
                          <badge.icon className="h-6 w-6" />
                        </div>
                        <span className="text-center text-sm font-medium text-foreground">
                          {badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <activity.icon className="h-4 w-4" />
                          </div>
                          {index < activities.length - 1 && (
                            <div className="mt-2 h-full w-px bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-foreground">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Position Specialization */}
              <Card>
                <CardHeader>
                  <CardTitle>Position Specialization (DOTA 2)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {positions.map((position, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {position.role}
                        </span>
                        <span className="text-muted-foreground">
                          Level {position.level} • {position.winRate}% WR
                        </span>
                      </div>
                      <Progress
                        value={position.progress}
                        className={
                          position.role === "Support"
                            ? "[&>div]:bg-primary"
                            : ""
                        }
                      />
                    </div>
                  ))}
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-primary/20 text-primary"
                  >
                    Support is your strongest position
                  </Badge>
                </CardContent>
              </Card>

              {/* Weekly Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklyGoals.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Checkbox id={`goal-${index}`} />
                        <label
                          htmlFor={`goal-${index}`}
                          className="flex-1 cursor-pointer text-sm font-medium text-foreground"
                        >
                          {item.goal}
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {item.progress}%
                        </span>
                      </div>
                      <Progress value={item.progress} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <GameSelectionModal
        open={showGameModal}
        onOpenChange={setShowGameModal}
        onGameConnect={handleGameConnect}
      />
      
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        connectedGame={connectedGames[0]}
      />

      {/* Mobile Navigation - Fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center py-2">
          <button 
            onClick={() => navigate("/")}
            className="flex flex-col items-center p-3 text-muted-foreground"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center p-3 text-primary"
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

export default Profile;
