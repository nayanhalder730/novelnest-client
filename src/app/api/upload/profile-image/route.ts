import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "ImgBB API key is missing.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select an image.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5MB.",
        },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      console.error("ImgBB upload error:", result);

      return NextResponse.json(
        {
          success: false,
          message: "Profile image upload failed.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
    });
  } catch (error) {
    console.error("Profile Image Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to upload profile image.",
      },
      { status: 500 }
    );
  }
}