# HerbChain – Hyperledger Fabric Monorepo

A Web3 application monorepo with smart contracts (chaincode), backend API, frontend interface, and scripts for running a Fabric test network.

## 🎗️ Architecture

This monorepo contains four main workspaces:

- `` – Hyperledger Fabric chaincode (smart contracts)
- `` – Node.js/Express API interacting with Fabric network
- `` – React/Vite application
- `` – Scripts to start the Fabric network and deploy chaincode

> **Note:** The Fabric `test-network` is **not included**. Clients must have `fabric-samples` installed separately.

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥18.0.0
- Docker & Docker Compose
- Git
- Hyperledger Fabric samples & binaries:

```bash
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples
curl -sSL https://bit.ly/2ysbOFE | bash -s
```

---

### Installation

1. **Clone this repo:**

```bash
git clone https://www.github.com/discombobulated-otter/herbChain
cd herbChain
```

2. **Install dependencies:**

```bash
cd backend
npm install
cd ../frontend
npm install
```

---

### Start Fabric Network & Deploy Chaincode

1. **Start network:**

```bash
cd scripts
./start-network.sh
```

2. **Deploy chaincode:**

```bash
./deploy-chaincode.sh
```

> These scripts automatically detect the repo paths and deploy your chaincode from `/chaincode`.

---

### Run Backend & Frontend

**Backend:**

```bash
cd ../backend
node app.js   # or npm start if defined
```

**Frontend:**

```bash
cd ../frontend
npm run dev
```

Frontend typically runs at `http://localhost:3000` and communicates with the backend.

---

## 📁 Project Structure

```
herbChain/
├── chaincode/         # Hyperledger Fabric smart contracts
│   └── mycc/
├── backend/           # API server
│   ├── network-profiles/
│   │   └── connection-org1.json
│   └── src/
├── frontend/          # React/Vite frontend
│   └── src/
├── scripts/           # Scripts for starting network and deploying chaincode
│   ├── start-network.sh
│   └── deploy-chaincode.sh
└── README.md
```

---

## 🔧 Technologies Used

### Chaincode

- Hyperledger Fabric v2.x
- Node.js / JavaScript chaincode

### Backend

- Node.js 18.x
- Express.js 4.x
- Hyperledger Fabric SDK (fabric-network)

### Frontend

- React 18.x
- Vite
- Tailwind CSS

---

## 🤚 Testing

- Backend & frontend tests can be run as usual:

```bash
cd backend && npm test
cd frontend && npm test
```

- Fabric network tests can be performed using `peer chaincode invoke` or SDK scripts.

---

## 🔒 Environment Variables

**Backend (.env):**

```env
PORT=3000
NODE_ENV=development
```

> Add any Fabric wallet paths or credentials if required for production.

---

## 📔 Notes for Clients

- Fabric `test-network` must be installed in `~/fabric-samples` by default.
- Scripts handle relative paths automatically; no manual edits required.
- Chaincode in `/chaincode` is deployed via scripts — clients do **not** need to move it.
- Only the repo, scripts, backend, frontend, and chaincode are included; **Fabric binaries and Docker images are not part of this repo**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Add tests if needed
5. Submit a pull request

---

## 📜 License

MIT License

