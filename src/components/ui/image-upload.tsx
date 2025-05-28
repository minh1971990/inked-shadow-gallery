import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  onRemoveImage: () => void;
  onFileSelect: (file: File | null) => void;
}

export function ImageUpload({
  onImageUploaded,
  currentImageUrl,
  onRemoveImage,
  onFileSelect,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "File size must be less than 5MB",
            variant: "destructive",
          });
          onFileSelect(null);
          setPreviewUrl(null);
          return;
        }

        if (!file.type.startsWith("image/")) {
          toast({
            title: "Error",
            description: "Please upload an image file",
            variant: "destructive",
          });
          onFileSelect(null);
          setPreviewUrl(null);
          return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onFileSelect(file);
        onImageUploaded(url);
      } else {
        onFileSelect(null);
        setPreviewUrl(null);
      }
    },
    [onFileSelect, onImageUploaded, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onFileSelect(null);
    onRemoveImage();
  };

  return (
    <div className="grid gap-4">
      <Label>Design Image</Label>
      <div className="flex flex-col gap-4">
        {!currentImageUrl && !previewUrl ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-white/20 hover:border-white/20"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-8 w-8 text-white/70" />
              <div className="text-sm text-white/70">
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <p>Drag & drop an image here, or click to select</p>
                )}
              </div>
              <div className="text-xs text-white/50">
                Supports: JPG, PNG, GIF (max 5MB)
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <img
                src={previewUrl || currentImageUrl}
                alt="Current design"
                className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-[1.02]"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-white">
                  Click or drag to change image
                </p>
                <Button
                  variant="destructive"
                  size="icon"
                  className="hover:scale-110 transition-transform"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
