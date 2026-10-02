import { ImageResponse } from "next/og";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const alt = `${SITE_NAME} — đọc truyện online`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG mặc định: nền ivory, mực charcoal, một gạch sepia. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffdf8",
          color: "#0a0a0a",
          padding: "80px",
        }}>
        <div style={{ fontSize: 128, letterSpacing: "-0.03em" }}>{SITE_NAME}</div>
        <div
          style={{
            marginTop: 28,
            fontSize: 38,
            color: "#8c8c8c",
            textAlign: "center",
            maxWidth: 900,
          }}>
          {SITE_DESCRIPTION}
        </div>
        <div
          style={{
            marginTop: 44,
            width: 180,
            height: 10,
            backgroundColor: "#512906",
            borderRadius: 10,
          }}
        />
      </div>
    ),
    size
  );
}
