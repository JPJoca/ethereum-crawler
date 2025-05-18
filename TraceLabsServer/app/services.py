from flask import request,jsonify
import requests
from app.config import ETHERSCAN_API_KEY


def get_response_from_Etherscan(address,start_block,end_block):
    
 
   #  address = request.args.get("address")
   #  start_block = request.args.get("start_block", default="0")

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
        response = requests.get(url,params=params)

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

    return response["result"]