import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File;

    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));

    if (!file) {
      return NextResponse.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const resizedImage = await sharp(buffer)
      .resize(width, height)
      .jpeg({ quality: 90 })
      .toBuffer();

    return new NextResponse(
      new Uint8Array(resizedImage),
      {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Disposition":
            "attachment; filename=resized.jpg",
        },
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Resize failed" },
      { status: 500 }
    );
  }
}