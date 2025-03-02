import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");
  const width = searchParams.get("width")
    ? parseInt(searchParams.get("width") as string)
    : 320;
  const format = searchParams.get("format") || "webp";
  const quality = searchParams.get("quality")
    ? parseInt(searchParams.get("quality") as string)
    : 100;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "URL gambar diperlukan" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    let image = sharp(Buffer.from(buffer)).resize(width, null, {
      kernel: "lanczos3",
    });

    if (format === "webp") {
      image = image.toFormat("webp", { quality, nearLossless: false });
    } else if (format === "jpeg" || format === "jpg") {
      image = image.toFormat("jpeg", {
        quality,
        progressive: true,
        mozjpeg: true,
      });
    } else if (format === "png") {
      image = image.toFormat("png", { quality, adaptiveFiltering: true, compressionLevel: 9 });
    }

    const optimizedImage = await image.toBuffer();

    return new NextResponse(optimizedImage, {
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Length": optimizedImage.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error optimizing image:", error);
    return NextResponse.json(
      { error: "Gagal memproses gambar" },
      { status: 500 }
    );
  }
}
