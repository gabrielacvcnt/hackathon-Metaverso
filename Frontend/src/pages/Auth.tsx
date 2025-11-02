import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    if (apiClient.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (signUpData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await apiClient.register({
        email: signUpData.email,
        password: signUpData.password,
        name: signUpData.fullName,
      });

      toast({
        title: "Account created!",
        description: "Welcome to RANKD. Please sign in to continue.",
      });
      
      // Switch to sign in tab after successful registration
      const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
      signInTab?.click();
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message || "An error occurred while creating your account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.login({
        email: signInData.email,
        password: signInData.password,
      });

      toast({
        title: "Welcome back!",
        description: "Redirecting to dashboard...",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 lg:mb-8 text-center">
          <div className="inline-flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-3 lg:mb-4">
            <span className="text-lg lg:text-2xl font-bold">RANKD</span>
          </div>
        </div>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl lg:text-2xl">Join RANKD</CardTitle>
                <CardDescription>
                  Start Your Gaming Evolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={signUpData.fullName}
                        onChange={(e) =>
                          setSignUpData({ ...signUpData, fullName: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) =>
                          setSignUpData({ ...signUpData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) =>
                          setSignUpData({ ...signUpData, password: e.target.value })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) =>
                          setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signin">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl lg:text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your RANKD account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) =>
                          setSignInData({ ...signInData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) =>
                          setSignInData({ ...signInData, password: e.target.value })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/password-reset" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
