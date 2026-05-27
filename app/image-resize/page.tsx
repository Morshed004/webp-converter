import ImageResize from "@/components/image-resize";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Image Resizer - Resize JPG & PNG Online Free",
  description:
    "Resize JPG and PNG images online for free. Change image dimensions while maintaining aspect ratio instantly.",
  keywords: [
    "image resizer",
    "resize image",
    "jpg resizer",
    "png resizer",
    "online image resize",
  ],
  openGraph: {
    title: "Image Resizer",
    description:
      "Resize JPG & PNG images online for free with custom dimensions.",
    type: "website",
  },
};

export default function ImageResizePage (){
  return (
    <ImageResize />
  )
}