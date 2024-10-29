# Greener Coin Bridge

Welcome to the Greener Coin Bridge project! This repository contains the code and documentation for the bridge that allows seamless transfer of coins between the Polygon blockchain and the GNC blockchain.

## Table of Contents

- Introduction
- Features
- Installation
- Usage
- Contributing

## Introduction

The Greener Coin Bridge is an innovative project designed to facilitate the transfer of GreenerCoin (GNC) between the Polygon blockchain and the GNC blockchain. GreenerCoin is the first certified green blockchain with low-energy consumption, powered by zero-carbon validators. This bridge aims to enhance the liquidity and usability of GNC by enabling cross-chain transactions.

## Features

- **Cross-Chain Transfers**: Seamlessly move GNC between the Polygon and GNC blockchains.
- **Low Energy Consumption**: Built on the eco-friendly principles of the GreenerCoin blockchain.
- **Secure and Fast**: Ensures secure and rapid transactions, leveraging the strengths of both blockchains.

## Installation

To get started with the Greener Coin Bridge, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/samirma/GNCBridge.git
    cd GNCBridge
    ```

## Usage

- Start only the `bot` service:
  ```bash
  docker-compose up bot
  ```

- Start only the `bridge` service:
  ```bash
  docker-compose up bridge
  ```

- Start both the `bot` and `bridge` services:
  ```bash
  docker-compose up bot bridge
  docker-compose up
  ```

- Start the `bot` service in detached mode:
  ```bash
  docker-compose up -d bot
  ```

- Rebuild and start the `bot` service:
```bash
docker-compose up --build bot
docker-compose up --build bridge
docker-compose up --build 
```

## Contributing

We welcome contributions from the community! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your fork.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

For more information about GreenerCoin and its mission, visit [GreenerCoin.io](https://www.greenercoin.io/).

