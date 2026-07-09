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
          background: "#05070b",
          border: "2px solid #38bdf8",
          borderRadius: "8px",
          display: "flex",
          height: "32px",
          justifyContent: "center",
          position: "relative",
          width: "32px",
        }}
      >
        <div
          style={{
            border: "3px solid #34d399",
            borderBottomColor: "transparent",
            borderRadius: "10px",
            height: "16px",
            left: "5px",
            position: "absolute",
            top: "8px",
            transform: "rotate(-25deg)",
            width: "18px",
          }}
        />
        <div
          style={{
            background: "#0b1422",
            border: "2px solid #f8fafc",
            borderRadius: "3px",
            height: "19px",
            left: "12px",
            position: "absolute",
            top: "6px",
            width: "13px",
          }}
        />
        <div
          style={{
            background: "#38bdf8",
            borderRadius: "1px",
            bottom: "8px",
            height: "7px",
            left: "16px",
            position: "absolute",
            width: "2px",
          }}
        />
        <div
          style={{
            background: "#34d399",
            borderRadius: "1px",
            bottom: "8px",
            height: "10px",
            left: "20px",
            position: "absolute",
            width: "2px",
          }}
        />
        <div
          style={{
            background: "#a78bfa",
            borderRadius: "1px",
            bottom: "8px",
            height: "13px",
            left: "24px",
            position: "absolute",
            width: "2px",
          }}
        />
      </div>
    ),
    size,
  );
}
