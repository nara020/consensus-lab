import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Consensus Lab - Interactive Blockchain Consensus Visualizer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #030308 0%, #0a0a1a 50%, #030308 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background effects */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 64, display: "flex", gap: 16 }}>
            <span>🔗</span>
            <span>⛓️</span>
            <span>🧪</span>
          </div>

          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #a78bfa 100%)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
            }}
          >
            Consensus Lab
          </h1>

          <p style={{ fontSize: 28, color: "#94a3b8", margin: 0 }}>
            10+ Blockchain Consensus Algorithms
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {["PoW", "PoS", "RAFT", "Tendermint", "Avalanche", "ZK"].map((name) => (
              <div
                key={name}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "rgba(139, 92, 246, 0.2)",
                  border: "2px solid rgba(139, 92, 246, 0.5)",
                  color: "#a78bfa",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
