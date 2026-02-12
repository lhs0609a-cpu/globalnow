import { NextRequest, NextResponse } from "next/server";

const NEWS_API_BASE = "https://newsapi.org/v2";

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return NextResponse.json(
      { status: "error", message: "NEWS_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "general";
  const country = searchParams.get("country") || "us";
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "20";

  try {
    let url: string;

    if (q) {
      // Use /everything endpoint for search queries
      const params = new URLSearchParams({
        q,
        page,
        pageSize,
        sortBy: "publishedAt",
        apiKey,
      });
      url = `${NEWS_API_BASE}/everything?${params.toString()}`;
    } else {
      // Use /top-headlines for category/country browsing
      const params = new URLSearchParams({
        category,
        country,
        page,
        pageSize,
        apiKey,
      });
      url = `${NEWS_API_BASE}/top-headlines?${params.toString()}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    const data = await response.json();

    if (data.status === "error") {
      return NextResponse.json(
        { status: "error", message: data.message },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
