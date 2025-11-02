import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gamepad2, Loader2, Shield } from "lucide-react";

interface GameSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameConnect: (game: string) => void;
}

const games = [
  {
    id: "dota",
    name: "DOTA",
    provider: "Steam",
    isPrimary: true,
    icon: "🎮",
  },
  {
    id: "valorant",
    name: "Valorant",
    provider: "Riot",
    isPrimary: false,
    icon: "🎯",
  },
  {
    id: "lol",
    name: "League of Legends",
    provider: "Riot",
    isPrimary: false,
    icon: "⚔️",
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    provider: "Steam",
    isPrimary: false,
    icon: "💥",
  },
];

export const GameSelectionModal = ({
  open,
  onOpenChange,
  onGameConnect,
}: GameSelectionModalProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (gameId: string) => {
    setConnecting(gameId);
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onGameConnect(gameId);
    setConnecting(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Connect Your Game</DialogTitle>
          <DialogDescription>
            Choose a game to start analyzing your performance
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {games.map((game) => (
            <div
              key={game.id}
              className={`relative rounded-lg border-2 p-4 transition-all hover:border-primary ${
                game.isPrimary ? "border-primary/50 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl">{game.icon}</div>
                <h3 className="font-semibold text-center">{game.name}</h3>
                <Button
                  size="sm"
                  variant={game.isPrimary ? "default" : "secondary"}
                  className="w-full"
                  onClick={() => handleConnect(game.id)}
                  disabled={connecting !== null}
                >
                  {connecting === game.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    `Connect via ${game.provider}`
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t pt-4">
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
            <Gamepad2 className="h-3 w-3" />
            You can connect more games later with Pro subscription
          </p>
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
            <Shield className="h-3 w-3 text-success" />
            Secure connection • We never store your passwords
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
