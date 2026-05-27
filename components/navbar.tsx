"use client";

import { FileImage, ImageIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps{
    text: string,
    link: string
}

export default function Navbar(props: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 z-50 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg"
          : "bg-slate-900/30 backdrop-blur-md border-b border-slate-700/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-linear-to-br from-red-500/20 to-purple-500/20 p-2 rounded-lg border border-red-500/30 group-hover:border-red-500/50 transition-all duration-300">
                <ImageIcon className="h-5 w-5 text-red-500 transition-transform group-hover:scale-110 group-hover:rotate-6" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className=" font-bold tracking-wider bg-linear-to-r from-white via-red-200 to-white bg-clip-text text-transparent uppercase">
                WebP Converter
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider">Image Optimizer</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Link href={props.link}>
            <Badge 
              variant="outline" 
              className="border-slate-700 bg-slate-800/50 text-slate-300 gap-2 px-3 py-1 hover:border-red-500/50 transition-all duration-300 hover:bg-red-500/10"
            >
              <FileImage className="h-3 w-3 text-red-400" />
              <span className="text-xs font-medium">{props.text}</span>
            </Badge>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}