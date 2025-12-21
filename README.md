<div align="center">

# 🧪 Consensus Lab

**Interactive 3D Blockchain Consensus Mechanism Visualizer**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge&logo=vercel)](https://consensus-lab.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

[Live Demo](https://consensus-lab.vercel.app) · [Report Bug](https://github.com/nara020/consensus-lab/issues) · [Request Feature](https://github.com/nara020/consensus-lab/issues)

<br />

<!-- Add your demo GIF here -->
![Consensus Lab Demo](./public/demo.gif)

*Learn how Bitcoin, Ethereum, and enterprise blockchains achieve consensus through beautiful real-time 3D simulations*

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Demo](#-demo)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Consensus Mechanisms](#-consensus-mechanisms-explained)
- [Performance](#-performance)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**Consensus Lab** is an educational visualization tool that brings blockchain consensus mechanisms to life through interactive 3D simulations. Instead of reading abstract descriptions, users can watch and understand how different networks achieve agreement in real-time.

### Why This Project?

- 📖 **Educational Gap**: Most blockchain education relies on text and static diagrams
- 🎮 **Interactive Learning**: See consensus happen in real-time with visual feedback
- 🔬 **Technical Accuracy**: Based on actual protocol specifications (Bitcoin Whitepaper, Ethereum Yellow Paper, RAFT Paper)
- 🌐 **Accessible**: Works on any modern browser with WebGL support

---

## 🎬 Demo

<!-- Add screenshots/GIFs for each consensus mechanism -->

| Proof of Work (Bitcoin) | Proof of Stake (Ethereum) |
|:-----------------------:|:-------------------------:|
| ![PoW Demo](./public/screenshots/pow.gif) | ![PoS Demo](./public/screenshots/pos.gif) |
| Mining race across regions, fork resolution, orphan blocks | Validator selection, attestations, finality |

| RAFT (Hyperledger Fabric) | IBFT 2.0 (Hyperledger Besu) |
|:-------------------------:|:---------------------------:|
| ![RAFT Demo](./public/screenshots/raft.gif) | ![IBFT Demo](./public/screenshots/ibft.gif) |
| Leader election, log replication, instant commit | 3-phase BFT consensus, Byzantine tolerance |

---

## ✨ Features

### 🔗 Four Consensus Mechanisms

| Mechanism | Network | Fault Tolerance | Finality | TPS |
|-----------|---------|-----------------|----------|-----|
| **Proof of Work** | Bitcoin | 51% attack resistant | ~60 min (6 blocks) | ~7 |
| **Proof of Stake** | Ethereum | 34% stake attack | ~13 min (2 epochs) | ~30 |
| **RAFT** | Hyperledger Fabric | CFT (N-1)/2 crashes | Instant | 3,000-20,000 |
| **IBFT 2.0** | Hyperledger Besu | BFT 33% Byzantine | Instant | 100-1,000 |

### 🎨 Visual & Interactive

- **3D WebGL Graphics** - Immersive visualization with Three.js
- **Real-time Simulation** - Watch consensus unfold step-by-step
- **Audio Feedback** - Sound effects for mining, voting, finalization
- **Bilingual Support** - English and Korean (한국어)
- **Responsive Design** - Desktop and mobile compatible

### 📊 Technical Details Shown

- Block propagation and fork resolution
- Validator/miner stake and rewards
- Network statistics (TPS, finality time, costs)
- Economic incentives and slashing conditions

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   UI Layer  │  │  3D Canvas  │  │  State Management   │  │
│  │  (React +   │  │  (R3F +     │  │  (useReducer +      │  │
│  │  Framer)    │  │  Three.js)  │  │  Custom Hooks)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Simulation Hooks Layer                 │    │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐  │    │
│  │  │usePoW    │ │usePoS    │ │useRaft │ │useQbft   │  │    │
│  │  │Simulation│ │Simulation│ │Sim     │ │Simulation│  │    │
│  │  └──────────┘ └──────────┘ └────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Types     │  │  Constants  │  │  i18n (en/ko)       │  │
│  │  (TS)       │  │  (Config)   │  │  (Translations)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **useReducer over Redux** | Simpler state management for component-scoped simulation state |
| **Custom Hooks per Consensus** | Encapsulated simulation logic, easy to test and extend |
| **React.memo + useMemo** | Prevent unnecessary re-renders in 60fps 3D environment |
| **Dynamic Imports** | Code-split 3D components to reduce initial bundle |
| **Strict Mode Disabled** | Prevent WebGL context issues from double mounting |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | React Framework | 16.1.0 |
| [React](https://react.dev/) | UI Library | 19.2.3 |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety | 5.x |
| [Tailwind CSS](https://tailwindcss.com/) | Styling | 4.x |

### 3D Graphics
| Technology | Purpose | Version |
|------------|---------|---------|
| [Three.js](https://threejs.org/) | 3D Engine | 0.182.0 |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | React Renderer | 9.4.2 |
| [@react-three/drei](https://github.com/pmndrs/drei) | Helpers | 10.3.1 |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | Effects | 3.1.1 |

### Animation & UX
| Technology | Purpose |
|------------|---------|
| [Framer Motion](https://www.framer.com/motion/) | UI Animations |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Sound Effects |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/nara020/consensus-lab.git
cd consensus-lab

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

### Environment Variables

No environment variables required for basic usage.

---

## 📁 Project Structure

```
consensus-lab/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Main entry point
│   │   └── globals.css         # Global styles
│   │
│   ├── components/
│   │   ├── ConsensusVisualization.tsx  # Main orchestrator
│   │   ├── ui/                 # UI components
│   │   │   ├── ModeSelector.tsx
│   │   │   ├── InfoPanel.tsx
│   │   │   ├── StartButton.tsx
│   │   │   ├── ReplayButton.tsx
│   │   │   ├── StepIndicator.tsx
│   │   │   └── LanguageToggle.tsx
│   │   ├── visualization/      # 3D components
│   │   │   ├── Block.tsx
│   │   │   ├── Node.tsx
│   │   │   ├── ChainLine.tsx
│   │   │   ├── TransactionParticle.tsx
│   │   │   ├── Effects.tsx
│   │   │   └── scenes/         # Consensus-specific scenes
│   │   │       ├── PoWScene.tsx
│   │   │       ├── PoSScene.tsx
│   │   │       ├── RaftScene.tsx
│   │   │       └── QbftScene.tsx
│   │   └── providers/          # React providers
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAudio.ts         # Sound effect management
│   │   ├── useSimulationState.ts  # Centralized state
│   │   └── simulations/        # Consensus simulation logic
│   │       ├── usePoWSimulation.ts
│   │       ├── usePoSSimulation.ts
│   │       ├── useRaftSimulation.ts
│   │       └── useQbftSimulation.ts
│   │
│   ├── constants/              # Configuration
│   │   └── consensusInfo.ts    # Consensus data & colors
│   │
│   ├── types/                  # TypeScript definitions
│   │   └── consensus.ts        # Core type definitions
│   │
│   └── i18n/                   # Internationalization
│       ├── index.tsx           # i18n provider & hook
│       ├── types.ts            # Translation types
│       ├── en.ts               # English translations
│       └── ko.ts               # Korean translations
│
├── public/
│   ├── sounds/                 # Audio files
│   └── screenshots/            # Demo images
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
└── package.json
```

---

## 📚 Consensus Mechanisms Explained

### ⛏️ Proof of Work (Bitcoin)

**Nakamoto Consensus** - The original blockchain consensus mechanism.

```
Mining Process:
1. Collect transactions into a block
2. Find nonce where SHA256(block + nonce) < target
3. Broadcast block to network
4. Longest chain wins (most accumulated work)
```

**Key Visualizations:**
- Three mining pools (N.America, Europe, Asia) racing to find valid hash
- Network latency causing temporary forks
- Fork resolution: longest chain becomes main, others become orphaned
- Economic impact: orphaned miners lose ~$310K block reward

**Security Model:**
- 6 confirmations ≈ 0.02% reorg probability
- 51% attack requires majority hashpower

---

### 🎰 Proof of Stake (Ethereum)

**Casper FFG + LMD GHOST** - Ethereum's hybrid consensus since The Merge.

```
Consensus Process:
1. Proposer selected based on stake (32 ETH minimum)
2. Block proposed for current slot (12 seconds)
3. Committee validators cast attestation votes
4. 2/3+ votes → Justified → Finalized (2 epochs)
```

**Key Visualizations:**
- Stake-proportional proposer selection
- Attestation votes flowing to blocks
- Justification and finalization status changes
- Slashing warnings for misbehavior

**Security Model:**
- Finality: ~13 minutes (2 epochs)
- Revert requires slashing 1/3 of stake (~$26B+)

---

### 📋 RAFT (Hyperledger Fabric)

**CFT (Crash Fault Tolerant)** - Designed for trusted private networks.

```
Consensus Process:
1. Transaction arrives at Leader
2. Leader appends to log
3. Leader replicates to Followers
4. Majority ACK (>50%) → Committed
```

**Key Visualizations:**
- Leader node with crown indicator
- Log replication lines to followers
- Replication count progress
- Instant finality on commit

**Fault Tolerance:**
- Can tolerate (N-1)/2 node crashes
- NOT Byzantine fault tolerant (assumes honest nodes)
- Heartbeat every 150ms

---

### 🛡️ IBFT 2.0 (Hyperledger Besu)

**BFT (Byzantine Fault Tolerant)** - Enterprise-grade consensus.

```
3-Phase Commit:
1. PRE-PREPARE: Proposer broadcasts block
2. PREPARE: Validators vote for agreement (2/3+)
3. COMMIT: Validators vote for finalization (2/3+)
```

**Key Visualizations:**
- Circular validator arrangement
- Vote lines showing PREPARE/COMMIT phases
- Quorum progress indicators
- Round-robin proposer rotation

**Fault Tolerance:**
- N ≥ 3f+1 validators required
- Tolerates up to 33% Byzantine (malicious) nodes
- Instant finality, no forks possible

---

## ⚡ Performance

### Lighthouse Scores

| Metric | Score |
|--------|-------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 100 |
| SEO | 100 |

### Optimizations Applied

- **Code Splitting**: Dynamic imports for 3D components
- **React.memo**: Prevent unnecessary re-renders
- **WebGL Context Management**: Proper cleanup and error handling
- **Font Optimization**: System font stack with drei defaults
- **Image Optimization**: Next.js Image component

---

## 🗺 Roadmap

- [x] Core visualization for 4 consensus mechanisms
- [x] Bilingual support (EN/KO)
- [x] Responsive design
- [x] Audio feedback
- [ ] Add more consensus mechanisms (Tendermint, HotStuff)
- [ ] Interactive parameter adjustment
- [ ] Educational quiz mode
- [ ] VR/AR support
- [ ] Comparison mode (side-by-side)

See [open issues](https://github.com/nara020/consensus-lab/issues) for feature requests.

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Update documentation for new features
- Add tests for critical functionality

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

## 📞 Contact

**Jinhyeok Kim**

[![GitHub](https://img.shields.io/badge/GitHub-nara020-black?style=flat-square&logo=github)](https://github.com/nara020)
[![Portfolio](https://img.shields.io/badge/Portfolio-jinhyeok.dev-blue?style=flat-square&logo=vercel)](https://jinhyeok.dev)
[![Email](https://img.shields.io/badge/Email-contact-red?style=flat-square&logo=gmail)](mailto:your-email@example.com)

---

<div align="center">

### ⭐ Star this repo if it helped you understand blockchain consensus!

Made with 💙 for the blockchain education community

</div>
