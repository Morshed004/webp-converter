"use client";

import Navbar from "@/components/navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowRight,
  CheckCircle,
  FileImage,
  ImageIcon,
  Loader2,
  Maximize2,
  MinusCircle,
  PlusCircle,
  Upload,
  XCircle,
  Lock,
  Unlock,
  RefreshCw,
} from "lucide-react";
import { useRef, useState } from "react";

export default function ImageResize() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [aspectRatio, setAspectRatio] = useState(true);
  const [originalAspect, setOriginalAspect] = useState(800 / 600);

  const [conversionStatus, setConversionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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
      setProgress((prev) => {
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

    // Get original image dimensions
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalAspect(img.width / img.height);
      URL.revokeObjectURL(imageUrl);
    };
    img.src = imageUrl;

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setLoading(true);
    setConversionStatus("idle");

    const progressInterval = simulateProgress();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("width", width.toString());
    formData.append("height", height.toString());

    try {
      const response = await fetch("/api/resize", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) throw new Error("Resize failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resized-${file.name}`;
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setWidth(value);
      if (aspectRatio) {
        setHeight(Math.round(value / originalAspect));
      }
    } else if (e.target.value === "") {
      setWidth(0);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setHeight(value);
      if (aspectRatio) {
        setWidth(Math.round(value * originalAspect));
      }
    } else if (e.target.value === "") {
      setHeight(0);
    }
  };

  const incrementWidth = () => {
    const newWidth = width + 50;
    setWidth(newWidth);
    if (aspectRatio) setHeight(Math.round(newWidth / originalAspect));
  };
  
  const decrementWidth = () => {
    const newWidth = Math.max(50, width - 50);
    setWidth(newWidth);
    if (aspectRatio) setHeight(Math.round(newWidth / originalAspect));
  };
  
  const incrementHeight = () => {
    const newHeight = height + 50;
    setHeight(newHeight);
    if (aspectRatio) setWidth(Math.round(newHeight * originalAspect));
  };
  
  const decrementHeight = () => {
    const newHeight = Math.max(50, height - 50);
    setHeight(newHeight);
    if (aspectRatio) setWidth(Math.round(newHeight * originalAspect));
  };

  const resetDimensions = () => {
    setWidth(800);
    setHeight(600);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none" />

      <Navbar text="WebP converter" link="/" />

      {/* Main Content with spacing for fixed navbar */}
      <div className="mt-20 w-full flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden relative group">
          {/* Animated Gradient Border Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/15 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-red-400 to-red-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

          <CardHeader className="text-center pb-6 relative pt-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-linear-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-red-500/20 shadow-lg shadow-red-500/10 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="h-7 w-7 text-red-400" />
            </div>

            <CardTitle className="text-3xl font-bold bg-linear-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
              Image Resizer
            </CardTitle>

            <CardDescription className="text-slate-400 flex items-center justify-center gap-2 mt-2">
              <span>Resize JPG & PNG images</span>
              <Badge
                variant="outline"
                className="border-slate-600 text-slate-300 text-xs bg-slate-800/50"
              >
                Free
              </Badge>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Dimension Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Maximize2 className="h-3.5 w-3.5 text-red-400" />
                  Dimensions
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAspectRatio(!aspectRatio)}
                    disabled={loading}
                    className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {aspectRatio ? (
                      <Lock className="h-3 w-3 text-green-400" />
                    ) : (
                      <Unlock className="h-3 w-3 text-slate-400" />
                    )}
                    <span className="text-slate-300">Ratio</span>
                  </button>
                  <button
                    onClick={resetDimensions}
                    disabled={loading}
                    className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-300">Reset</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Width Control */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-mono">WIDTH</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementWidth}
                      disabled={loading}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={width || ""}
                      onChange={handleWidthChange}
                      disabled={loading}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all disabled:opacity-50 font-mono"
                    />
                    <button
                      onClick={incrementWidth}
                      disabled={loading}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Height Control */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-mono">HEIGHT</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementHeight}
                      disabled={loading}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={height || ""}
                      onChange={handleHeightChange}
                      disabled={loading}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all disabled:opacity-50 font-mono"
                    />
                    <button
                      onClick={incrementHeight}
                      disabled={loading}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dimension Preview */}
              <div className="bg-slate-800/30 rounded-lg p-2 text-center">
                <span className="text-xs text-slate-500">
                  Preview: {width} × {height} pixels
                </span>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                loading
                  ? "border-slate-700 bg-slate-800/20 cursor-not-allowed opacity-60"
                  : "border-slate-700 hover:border-red-500/50 bg-slate-800/20 hover:bg-slate-800/30 cursor-pointer hover:shadow-lg hover:shadow-red-500/5 group/upload"
              }`}
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
                <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                  <div className="mx-auto w-12 h-12 rounded-full bg-linear-to-br from-red-500/10 to-purple-500/10 flex items-center justify-center group-hover/upload:scale-110 transition-transform duration-300">
                    <Upload className="h-6 w-6 text-slate-400 group-hover/upload:text-red-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Click to upload image
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="flex items-center justify-center gap-3">
                    {conversionStatus === "success" ? (
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    ) : conversionStatus === "error" ? (
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-shake">
                        <XCircle className="h-5 w-5 text-red-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <FileImage className="h-5 w-5 text-blue-400 animate-pulse" />
                      </div>
                    )}

                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate max-w-45">
                        {fileName}
                      </p>
                      <p className="text-xs text-slate-500">{fileSize}</p>
                    </div>

                    {conversionStatus === "idle" && !loading && (
                      <ArrowRight className="h-4 w-4 text-slate-500 animate-pulse" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Resizing image...</span>
                  <span className="text-red-400 font-mono font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-800" />
                <p className="text-xs text-slate-500 text-center animate-pulse">
                  Please wait while we process your image
                </p>
              </div>
            )}

            {/* Status Alerts */}
            {conversionStatus === "success" && (
              <Alert className="border-green-500/50 bg-green-500/10 text-green-300 animate-in slide-in-from-top-2 fade-in duration-300">
                <CheckCircle className="h-4 w-4 animate-bounce" />
                <AlertDescription className="text-sm">
                  Image resized successfully! Download started automatically.
                </AlertDescription>
              </Alert>
            )}

            {conversionStatus === "error" && (
              <Alert className="border-red-500/50 bg-red-500/10 text-red-300 animate-in slide-in-from-top-2 fade-in duration-300">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Failed to resize image. Please check the file format and try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="pt-2 pb-8">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group/btn"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Image...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" />
                  Select Image to Resize
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}