import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#07111d",
          border: "2px solid #38bdf8",
          borderRadius: "8px",
          display: "flex",
          height: "32px",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          width: "32px",
        }}
      >
        <div
          style={{
            color: "#f8fafc",
            fontFamily: "Arial, sans-serif",
            fontSize: "17px",
            fontWeight: 900,
            left: "4px",
            lineHeight: 1,
            position: "absolute",
            top: "9px",
          }}
        >
          C
        </div>
        <div
          style={{
            color: "#38bdf8",
            fontFamily: "Arial, sans-serif",
            fontSize: "17px",
            fontWeight: 900,
            left: "15px",
            lineHeight: 1,
            position: "absolute",
            top: "9px",
          }}
        >
          B
        </div>
        <div
          style={{
            background: "#38bdf8",
            borderRadius: "999px",
            bottom: "5px",
            height: "2px",
            left: "8px",
            position: "absolute",
            width: "16px",
          }}
        />
      </div>
    ),
    size,
  );
}
