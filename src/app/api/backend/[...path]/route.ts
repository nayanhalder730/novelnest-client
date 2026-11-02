import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend URL is not configured.",
        },
        { status: 500 },
      );
    }

    const { path } = await context.params;

    const backendUrl = new URL(
      `${API_URL.replace(/\/$/, "")}/${path.join("/")}`,
    );

    backendUrl.search = new URL(request.url).search;

    // Forward authentication cookie.
    const headers = new Headers();

    const cookie = request.headers.get("cookie");
    const authorization = request.headers.get("authorization");
    const contentType = request.headers.get("content-type");
    const accept = request.headers.get("accept");

    if (cookie) headers.set("cookie", cookie);
    if (authorization) headers.set("authorization", authorization);
    if (contentType) headers.set("content-type", contentType);
    if (accept) headers.set("accept", accept);

    const method = request.method;

    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const backendResponse = await fetch(backendUrl.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseBody = await backendResponse.arrayBuffer();

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") ||
          "application/json",
      },
    });
  } catch (error) {
    console.error("Backend Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the backend server.",
      },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}