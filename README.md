# Ethereum Transactions Crawler

## Overview

This project is a web application that allows users to explore Ethereum blockchain transaction data for a specific wallet address, starting from a given block number.

- Wallet addresses involved in transactions
- Amounts of ETH sent/received and used for transaction
- Checking the ETH balance of a wallet at a specific date and time (00:00 UTC)

The backend is built with **Python (Flask)**, and the frontend is built using **React**.

---


##  How to Run the Project

### Backend Setup (Flask)

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd TraceLabsServer
   
2. Create and activate a virtual environment:
  
   ```bash
   python -m venv venv
   venv\Scripts\activate
   
3. Install dependencies:

   ```bash
   pip install -r requirements.txt

4. Edit `.env` file and add your API key, e.g.:
   ```bash
   ETHERSCAN_API_KEY="<ENTER_YOUR_API>"
   INFURA_API_KEY="<ENTER_YOUR_API>"
   
5. Run the Flask server:

   ```bash
    python run.py

### Frontend Setup (React)

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd trace-labs-client
   
3. Install dependencies:

   ```bash
   npm install

5. Start the React server:

   ```bash
    npm run dev 
