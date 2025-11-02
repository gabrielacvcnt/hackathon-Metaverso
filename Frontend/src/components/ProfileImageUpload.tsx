import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface ProfileImageUploadProps {
  currentImageUrl?: string | null;
  userName: string;
  onImageUpdated?: (newImageUrl: string | null) => void;
}

export function ProfileImageUpload({ 
  currentImageUrl, 
  userName, 
  onImageUpdated 
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem válida (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione uma imagem menor que 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    
    try {
      const response = await apiClient.uploadProfileImage(file);
      
      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso",
      });

      if (onImageUpdated) {
        onImageUpdated(response.profile_url);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
      
      // Reset preview on error
      setPreviewUrl(currentImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative">
      <Avatar className="h-20 w-20 lg:h-32 lg:w-32">
        <AvatarImage src={previewUrl || undefined} />
        <AvatarFallback className="bg-primary text-xl lg:text-4xl text-primary-foreground">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
      
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 h-6 w-6 lg:h-8 lg:w-8 rounded-full"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="h-3 w-3 lg:h-4 lg:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Camera className="h-3 w-3 lg:h-4 lg:w-4" />
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}