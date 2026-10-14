import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F1E36",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 340,
            height: 230,
            border: "16px solid #C8102E",
            borderRadius: 24,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          DAAK
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
