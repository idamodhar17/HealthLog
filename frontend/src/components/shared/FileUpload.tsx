import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  multiple = false,
  maxSize = 10,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSize * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxSizeBytes) {
        setError(`${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
        setSelectedFiles(newFiles);
        onFileSelect(newFiles);
      }
    },
    [multiple, selectedFiles, onFileSelect, maxSize]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(newFiles);
      onFileSelect(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
            isDragging ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported: PDF, JPG, PNG, DOC, DOCX (Max {maxSize}MB)
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => {
            const FileIcon = getFileIcon(file);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
