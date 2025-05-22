from flask import request,jsonify
import requests
from app.config import ETHERSCAN_API_KEY,INFIURA_API_KEY
from ens import ENS
from web3 import Web3

def get_txlist_from_Etherscan(address,start_block,end_block):
    if not address:
        return None

    url = (
        "https://api.etherscan.io/api"
    )

    params = {
        "module": "account",
        "action": "txlist",
        "address": address,
        "startblock": start_block,
        "endblock": end_block,
        "sort": "asc",
        "apikey": ETHERSCAN_API_KEY
    }

    try:
        response = requests.get(url, params=params)

        response.raise_for_status()
        data = response.json()

        if data.get("status") == "1" and "result" in data:
            return data["result"]
        else:
            print(f"Etherscan error message: {data.get('message', 'Unknown error')}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def get_getblocknobytime_from_Etherscan(timestamp,closest):

    print("uslo")
    url = (
        "https://api.etherscan.io/api"
    )

    params = {
        "module": "block",
        "action": "getblocknobytime",
        "timestamp": timestamp,
        "closest": closest,
        "apikey":ETHERSCAN_API_KEY
    }

    try:
        response = requests.get(url,params=params)

        response.raise_for_status()
        data = response.json()
        if data.get("status") == "1" and "result" in data:
            return int(data["result"])
        else:
            print(f"Etherscan error message: {data.get('message', 'Unknown error')}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

# Couldn't get it to work so i used Infura-s api
def get_balance_from_Etherscan(address,block_number):

    if not address:
        return None

    if not block_number:
        return None
    url = (
        "https://api.etherscan.io/api"
    )

    params = {
        "module": "account",
        "action": "balance",
        "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "tag":  hex(int(block_number )),
        "apikey":ETHERSCAN_API_KEY
    }
    print(params)
    try:
        response = requests.get(url,params=params)
        print("Request URL:", response.url)
        print("Response JSON:", response.json())
        response.raise_for_status()
        data = response.json()
        print(data)
        if data.get("status") == "1" and "result" in data:
            return data
        else:
            print(f"Etherscan error message: {data.get('message', 'Unknown error')}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def get_balance(address,block_number):
    w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/' + INFIURA_API_KEY))

    checksum_address = Web3.to_checksum_address(address)

    balance_wei = w3.eth.get_balance(checksum_address, block_identifier=block_number )
    balance_eth = w3.from_wei(balance_wei, 'ether')

    return balance_eth