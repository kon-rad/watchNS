import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isAllowedHost(host: string): boolean {
  return host.endsWith(".cdninstagram.com") || host.endsWith(".fbcdn.net");
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) return new NextResponse("Missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new NextResponse("Bad url", { status: 400 });
  }
  if (parsed.protocol !== "https:" || !isAllowedHost(parsed.hostname)) {
    return new NextResponse("Disallowed host", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.instagram.com/",
        // Same-origin avoids `400 SecFetch Policy violation` from IG's edge.
        "Sec-Fetch-Site": "same-origin",
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new NextResponse(`Upstream ${upstream.status}`, {
      status: upstream.status === 404 ? 404 : 502,
    });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // IG's signed URLs expire (oe param ~24h). Cache shorter than that.
      "Cache-Control": "public, max-age=43200, s-maxage=43200, immutable",
    },
  });
}
