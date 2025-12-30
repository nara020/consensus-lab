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
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Glowing orbs */}
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

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            zIndex: 10,
          }}
        >
          {/* Logo/Icon area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 64,
                display: "flex",
              }}
            >
              🔗
            </div>
            <div
              style={{
                fontSize: 64,
                display: "flex",
              }}
            >
              ⛓️
            </div>
            <div
              style={{
                fontSize: 64,
                display: "flex",
              }}
            >
              🧪
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #a78bfa 100%)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              letterSpacing: -2,
            }}
          >
            Consensus Lab
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 28,
              color: "#94a3b8",
              margin: 0,
              marginTop: -5,
            }}
          >
            Interactive Blockchain Consensus Visualizer
          </p>

          {/* Algorithm badges */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 900,
            }}
          >
            {[
              { name: "PoW", color: "#f7931a" },
              { name: "PoS", color: "#627eea" },
              { name: "RAFT", color: "#2c9ed4" },
              { name: "QBFT", color: "#3c3c3d" },
              { name: "Tendermint", color: "#2e3148" },
              { name: "Avalanche", color: "#e84142" },
              { name: "Sui", color: "#6fbcf0" },
              { name: "Optimistic", color: "#ff0420" },
              { name: "ZK", color: "#8b5cf6" },
              { name: "Ripple", color: "#23292f" },
            ].map((algo) => (
              <div
                key={algo.name}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: `${algo.color}20`,
                  border: `2px solid ${algo.color}50`,
                  color: algo.color,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {algo.name}
              </div>
            ))}
          </div>

          {/* Footer */}
          <p
            style={{
              fontSize: 18,
              color: "#64748b",
              marginTop: 30,
            }}
          >
            Learn blockchain consensus through interactive 3D visualizations
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
