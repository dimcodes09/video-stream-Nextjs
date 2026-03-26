import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    });

    return Response.json({
      authenticationParameters,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT, // ✅ IMPORTANT
    });

  } catch (error) {
    console.error("IMAGEKIT AUTH ERROR:", error);

    return Response.json(
      { error: "ImageKit auth failed" },
      { status: 500 }
    );
  }
}