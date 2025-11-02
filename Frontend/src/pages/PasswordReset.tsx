import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email de redefinição");
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
              <CardTitle className="text-2xl font-bold">Email Enviado!</CardTitle>
              <CardDescription>
                Verifique sua caixa de entrada
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Enviamos um link de redefinição de senha para <strong>{email}</strong>. 
                Verifique também sua pasta de spam.
              </AlertDescription>
            </Alert>

            <div className="text-center text-sm text-muted-foreground">
              <p>O link expira em 1 hora.</p>
              <p className="mt-2">
                Não recebeu o email?{" "}
                <button 
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="text-primary hover:underline"
                >
                  Tentar novamente
                </button>
              </p>
            </div>

            <div className="pt-4 border-t">
              <Link to="/auth">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Button>
              </Link>
            </div>
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
            <CardTitle className="text-2xl font-bold">Esqueceu sua senha?</CardTitle>
            <CardDescription>
              Digite seu email e enviaremos um link para redefinir sua senha
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
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Link de Redefinição
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Lembrou da senha?{" "}
              <Link to="/auth" className="text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;