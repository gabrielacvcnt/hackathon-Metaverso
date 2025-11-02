import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";

const PasswordResetConfirm = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token inválido ou ausente");
    }
  }, [token]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Token inválido");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("A senha não atende aos critérios de segurança");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/user/password-reset/confirm/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao redefinir senha');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="text-2xl font-bold text-primary">RANKD</div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-green-600">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                Senha Redefinida!
              </CardTitle>
              <CardDescription>
                Sua senha foi alterada com sucesso
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <Alert>
              <AlertDescription>
                Sua senha foi redefinida com sucesso. Redirecionando para o login...
              </AlertDescription>
            </Alert>

            <Link to="/auth">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir para Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="text-2xl font-bold text-primary">RANKD</div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
            <CardDescription>
              Digite sua nova senha abaixo
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {newPassword && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Critérios da senha:</p>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos 8 caracteres
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos uma letra maiúscula
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos uma letra minúscula
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos um número
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos um caractere especial
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {confirmPassword && (
                <div className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !passwordValidation.isValid || !passwordsMatch}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary">
              Voltar ao login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetConfirm;