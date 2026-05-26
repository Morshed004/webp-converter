import sharp from "sharp";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    return new Response(webpBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition":
          `attachment; filename="converted.webp"`
      }
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Conversion failed" },
      { status: 500 }
    );
  }
}