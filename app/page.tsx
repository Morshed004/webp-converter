"use client";

import { useState } from "react";
import { Image as ImageIcon, Loader2, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Conversion failed");
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.webp";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased font-sans text-foreground">
      
      {/* shadcn/ui Navbar */}
      <nav className="w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border px-6 py-3 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo Text */}
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <span className="text-sm font-semibold tracking-wider text-foreground uppercase">
              WebP Convert
            </span>
          </div>

          {/* Theme Toggle Placeholder */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Sun className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-sm w-full shadow-md border-border">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              WebP Converter
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Convert your JPG or PNG images instantly
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col gap-4">
            {/* Custom Styled Upload Button using shadcn primitives */}
            <Button
              asChild
              disabled={loading}
              className="w-full py-6 text-sm font-medium cursor-pointer"
            >
              <label>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Converting...
                  </span>
                ) : (
                  "Choose Image"
                )}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleUpload}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </Button>

            {/* Loading Helper Text */}
            {loading && (
              <p className="text-xs text-center text-muted-foreground animate-pulse">
                Please wait while we process your file.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}