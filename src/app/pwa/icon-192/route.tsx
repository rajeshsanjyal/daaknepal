import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(<Mark size={192} />, { width: 192, height: 192 });
}

function Mark({ size }: { size: number }) {
  return (
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
          width: size * 0.68,
          height: size * 0.48,
          border: "8px solid #C8102E",
          borderRadius: 12,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.16,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        DAAK
      </div>
    </div>
  );
}
