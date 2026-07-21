import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text")?.trim() ?? "";
  if (!text || text.length > 80) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  const url = new URL("https://translate.googleapis.com/translate_tts");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("ie", "UTF-8");
  url.searchParams.set("tl", "en");
  url.searchParams.set("q", text);

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
        Referer: "https://translate.google.com/",
      },
      cache: "force-cache",
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "TTS upstream failed" }, { status: 502 });
    }

    const audio = await upstream.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "audio/mpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "TTS fetch failed" }, { status: 502 });
  }
}
