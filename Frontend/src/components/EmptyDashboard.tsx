import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, TrendingUp, Trophy, Users, CheckCircle } from "lucide-react";
import { GameSelectionModal } from "./GameSelectionModal";
import { useToast } from "@/hooks/use-toast";

interface EmptyDashboardProps {
  userName?: string;
  onGameConnect?: () => void;
}

export const EmptyDashboard = ({ userName = "Player", onGameConnect }: EmptyDashboardProps) => {
  const [showGameModal, setShowGameModal] = useState(false);
  const { toast } = useToast();

  const handleGameConnect = (gameId: string) => {
    toast({
      title: "Game Connected!",
      description: `Successfully connected ${gameId.toUpperCase()}. Loading your dashboard...`,
    });
    onGameConnect?.();
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to LSX, {userName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect your first game to unlock your performance analytics
          </p>
        </div>

        {/* Main Illustration Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="pt-12 pb-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                <div className="relative bg-card p-8 rounded-2xl border-2 border-primary/30">
                  <Gamepad2 className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Analyze your match performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep dive into your gameplay metrics and statistics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Track your improvement over time</h3>
                  <p className="text-sm text-muted-foreground">
                    Watch your skills evolve with detailed progress charts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Trophy className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Earn badges and level up</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock achievements as you master different skills
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Compare your stats with peers</h3>
                  <p className="text-sm text-muted-foreground">
                    See how you stack up against other players
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => setShowGameModal(true)}
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Connect Your First Game
              </Button>
              <p className="text-sm text-muted-foreground">
                It only takes 30 seconds to connect via Steam
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Secure connection • We never access your login details</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Here's what you'll see:
            </h3>
            <div className="grid md:grid-cols-3 gap-4 opacity-60">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium mb-1">Performance Metrics</h4>
                <p className="text-xs text-muted-foreground">
                  Real-time stats tracking
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <Gamepad2 className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium mb-1">Progress Charts</h4>
                <p className="text-xs text-muted-foreground">
                  Visual improvement graphs
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <Trophy className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium mb-1">Achievement Badges</h4>
                <p className="text-xs text-muted-foreground">
                  Unlock as you progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GameSelectionModal
        open={showGameModal}
        onOpenChange={setShowGameModal}
        onGameConnect={handleGameConnect}
      />
    </div>
  );
};
