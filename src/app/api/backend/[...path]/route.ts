
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

const AUTH_URL = (
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function getBearerToken(
  cookie: string | null
): Promise<string | null> {
  if (!cookie) return null;

  try {
    const tokenResponse = await fetch(
      `${AUTH_URL}/api/auth/token`,
      {
        method: "GET",
        headers: {
          cookie,
        },
        cache: "no-store",
      }
    );

    if (!tokenResponse.ok) return null;

    const tokenData: { token?: string } =
      await tokenResponse.json();

    return typeof tokenData.token === "string"
      ? tokenData.token
      : null;
  } catch (error) {
    console.error("JWT retrieval failed:", error);
    return null;
  }
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend URL is not configured.",
        },
        { status: 500 }
      );
    }

    const { path } = await context.params;

    const backendUrl = new URL(
      `${API_URL.replace(/\/+$/, "")}/${path.join("/")}`
    );

    backendUrl.search = new URL(request.url).search;

    const headers = new Headers();

    const cookie = request.headers.get("cookie");
    const authorization = request.headers.get("authorization");
    const contentType = request.headers.get("content-type");
    const accept = request.headers.get("accept");

    if (contentType) {
      headers.set("content-type", contentType);
    }

    if (accept) {
      headers.set("accept", accept);
    }

    // Use an existing Bearer token if supplied.
    if (authorization?.startsWith("Bearer ")) {
      headers.set("authorization", authorization);
    } else {
      // Otherwise generate JWT from the Better Auth session.
      const token = await getBearerToken(cookie);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }

    const method = request.method;

    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const backendResponse = await fetch(
      backendUrl.toString(),
      {
        method,
        headers,
        body,
        cache: "no-store",
        redirect: "manual",
      }
    );

    const responseBody =
      await backendResponse.arrayBuffer();

    const responseHeaders = new Headers();

    const responseContentType =
      backendResponse.headers.get("content-type");

    if (responseContentType) {
      responseHeaders.set(
        "Content-Type",
        responseContentType
      );
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the backend server.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  return proxyRequest(request, context);
}
