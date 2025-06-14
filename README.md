# Coixa Wallet

Coixa is a modern, open-source wallet application for the Pi Network, built with React and TypeScript. It enables users to securely create, import, and manage Pi cryptocurrency wallets, perform transactions, and view account activity with a user-friendly interface.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Technologies](#core-technologies)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Coixa Wallet** aims to provide a seamless, secure, and approachable interface for managing digital assets on the Pi Network. The application leverages modern frontend practices and robust blockchain integrations to deliver an optimal user experience. 

- **Domain:** Financial Technology (FinTech), Cryptocurrency Wallet
- **Supported Networks:** Pi Network Mainnet & Testnet

---

## Features

- **Wallet Management**
  - Create new Pi wallets with secure mnemonic generation
  - Import existing wallets using mnemonic phrases
  - Unlock and access wallets with security features

- **Transaction Capabilities**
  - Send and receive Pi using public keys or QR codes
  - View transaction history and account balances
  - Account activation and airdrop support (for testnet)

- **User Experience**
  - Responsive, dark-mode-enabled UI
  - Animated transitions and feedback
  - QR code generation for wallet addresses
  - Copy-to-clipboard support

- **Developer-Friendly**
  - TypeScript-first codebase
  - Modular context-driven state management
  - Configurable for mainnet/testnet environments

- **Security**
  - Local mnemonic and key management
  - No private keys are ever transmitted or exposed

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/mz0x0100/Coixa.git
cd Coixa
npm install    # or yarn install
```

### Running the App

```bash
npm run dev    # or yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---

## Project Structure

```
Quantra/
├── src/
│   ├── pages/             # Main app pages (Landing, Dashboard, Wallet screens)
│   ├── components/        # Reusable UI components (QR code, Transaction, Settings)
│   ├── wallet/            # Blockchain and wallet logic (PiApi, PiWallet)
│   ├── context/           # React context providers (WalletContext)
│   ├── services/          # API and market data services
│   ├── utils.ts           # Utility functions for mnemonic and key management
│   ├── theme.ts           # MUI theme configuration
│   ├── App.tsx            # Main application entry
│   └── main.tsx           # App bootstrap
├── public/
├── index.html
└── README.md
```

---

## Core Technologies

- **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **UI/UX:** [Material-UI (MUI)](https://mui.com/), [Framer Motion](https://www.framer.com/motion/), [QRCode](https://github.com/zpao/qrcode.react)
- **Blockchain Integration:** [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk) (for Pi Network)
- **Key Management:** [bip39](https://github.com/bitcoinjs/bip39), [micro-key-producer](https://github.com/paulmillr/micro-key-producer)
- **Linting and Code Quality:** [ESLint](https://eslint.org/)

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Disclaimer:** Quantra Wallet is provided as-is, and is not affiliated with the official Pi Network team. Use at your own risk.
