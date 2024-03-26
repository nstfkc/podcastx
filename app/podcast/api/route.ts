import { NextRequest } from "next/server";

const objectUrl =
  "https://pub-260e0262f8e340f1ba20f94a934263d0.r2.dev/The%20Real%20Story%20of%20Oppenheimer.mp4";

const adUrl =
  "https://pub-260e0262f8e340f1ba20f94a934263d0.r2.dev/One%20You%201-minute%20TV%20advert.mp4";

export async function GET(req: NextRequest) {
  const range = req.headers.get("Range");
  const showAd = req.nextUrl.searchParams.get("ad") === "true";
  const requestHeaders = new Headers();

  if (range) {
    requestHeaders.append("Range", range);
  }

  const url = showAd ? adUrl : objectUrl;

  const obj = await fetch(url, {
    headers: requestHeaders,
  });

  const contentType = obj.headers.get("content-type");
  const contentLength = obj.headers.get("content-length");

  let headers = {};
  let status = 200;

  if (range) {
    status = 206;
    headers = {
      "Content-Range": obj.headers.get("content-range"),
      "Content-Length": obj.headers.get("content-length"),
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
    };
  } else {
    headers = {
      "Content-Length": contentLength,
      "Content-Type": contentType,
    };
  }

  return new Response(obj.body, { headers, status });
}
