"use client";

import { useState, useRef } from "react";
import { 
  Image as ImageIcon, 
  Loader2, 
  Upload, 
  FileImage, 
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/navbar";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [conversionStatus, setConversionStatus] = useState<"idle" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.includes("jpeg") && !file.type.includes("png")) {
      setConversionStatus("error");
      setTimeout(() => setConversionStatus("idle"), 3000);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setConversionStatus("error");
      setTimeout(() => setConversionStatus("idle"), 3000);
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setLoading(true);
    setConversionStatus("idle");

    const progressInterval = simulateProgress();

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.split(".")[0]}.webp`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setConversionStatus("success");
      
      setTimeout(() => {
        setConversionStatus("idle");
        setFileName(null);
        setFileSize(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setConversionStatus("error");
      setTimeout(() => setConversionStatus("idle"), 3000);
    } finally {
      setLoading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative flex flex-col antialiased font-sans selection:bg-red-500/30">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none" />

      {/* Centered Navbar */}
      <Navbar text="Image Resizer" link="/image-resize" />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <Card className="w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden group">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/20 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <CardHeader className="text-center pb-4 relative">
            <div className="mx-auto w-12 h-12 rounded-xl bg-linear-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-red-500/20">
              <ImageIcon className="h-6 w-6 text-red-400" />
            </div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
              WebP Converter
            </CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Convert JPG and PNG images to WebP format instantly
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* File Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
                ${loading ? 'border-slate-700 bg-slate-800/30' : 'border-slate-700 hover:border-red-500/50 bg-slate-800/20 hover:bg-slate-800/30 cursor-pointer'}
                ${conversionStatus === 'error' ? 'border-red-500/50 bg-red-500/10' : ''}
                ${conversionStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : ''}
              `}
              onClick={() => !loading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleUpload}
                disabled={loading}
                className="hidden"
              />
              
              {!fileName ? (
                <div className="space-y-2">
                  <Upload className={`h-8 w-8 mx-auto transition-colors duration-200
                    ${conversionStatus === 'error' ? 'text-red-400' : 'text-slate-500'}`} 
                  />
                  <p className="text-sm text-slate-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    JPG, PNG (max 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {conversionStatus === 'success' ? (
                      <CheckCircle className="h-6 w-6 text-green-400 animate-bounce" />
                    ) : conversionStatus === 'error' ? (
                      <XCircle className="h-6 w-6 text-red-400" />
                    ) : (
                      <FileImage className="h-6 w-6 text-blue-400 animate-pulse" />
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-200 truncate max-w-50">
                        {fileName}
                      </p>
                      <p className="text-xs text-slate-500">{fileSize}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Conversion Progress */}
            {loading && (
              <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Converting to WebP...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}

            {/* Status Messages */}
            {conversionStatus === 'success' && (
              <Alert className="border-green-500/50 bg-green-500/10 text-green-300 animate-in fade-in zoom-in duration-300">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Conversion successful! Download started automatically.
                </AlertDescription>
              </Alert>
            )}

            {conversionStatus === 'error' && (
              <Alert className="border-red-500/50 bg-red-500/10 text-red-300 animate-in fade-in zoom-in duration-300">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Conversion failed. Please check file format and try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="pt-2 pb-6">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}