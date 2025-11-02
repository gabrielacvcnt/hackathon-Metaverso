import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, Lock } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectedGame?: string;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
  connectedGame = "DOTA",
}: UpgradeModalProps) => {
  const games = [
    { name: "DOTA", connected: connectedGame === "DOTA" },
    { name: "Valorant", connected: false },
    { name: "League of Legends", connected: false },
    { name: "Counter-Strike 2", connected: false },
  ];

  const features = [
    { feature: "Games", free: "1 game", pro: "3+ games" },
    { feature: "Analytics", free: "Basic", pro: "Advanced" },
    { feature: "Badges", free: "Essential", pro: "All + Exclusive" },
    { feature: "Support", free: "Standard", pro: "Priority" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            Unlock Multi-Game Analytics
          </DialogTitle>
          <DialogDescription>
            Upgrade to Pro to connect unlimited games
          </DialogDescription>
        </DialogHeader>

        {/* Current Status */}
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your Current Plan:</span>
            <span className="font-semibold">Free</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {games.map((game) => (
              <div
                key={game.name}
                className={`flex items-center gap-2 rounded-lg border p-3 ${
                  game.connected
                    ? "border-success/50 bg-success/5"
                    : "border-border bg-muted/30"
                }`}
              >
                {game.connected ? (
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    game.connected ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {game.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="rounded-lg border">
          <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-t-lg">
            <div className="text-sm font-medium"></div>
            <div className="text-sm font-medium text-center">FREE</div>
            <div className="text-sm font-medium text-center text-primary">PRO</div>
          </div>
          {features.map((item, index) => (
            <div
              key={item.feature}
              className={`grid grid-cols-3 gap-4 p-3 ${
                index !== features.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="text-sm text-muted-foreground">{item.feature}</div>
              <div className="text-sm text-center">{item.free}</div>
              <div className="text-sm text-center font-medium text-primary">
                {item.pro}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="text-center space-y-2 py-4 border-y">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Crown className="h-3 w-3" />
            PRO PLAN
          </div>
          <div className="text-3xl font-bold">R$ 9,90<span className="text-lg text-muted-foreground">/month</span></div>
          <div className="text-sm text-muted-foreground">
            or R$ 99/year <span className="text-success">(save 17%)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full" size="lg" onClick={() => {
            // TODO: Navigate to payment page
            console.log("Upgrade to Pro clicked");
          }}>
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
