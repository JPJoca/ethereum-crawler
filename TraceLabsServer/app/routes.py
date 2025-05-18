from flask import Blueprint, request, jsonify
from app.config import ETHERSCAN_API_KEY
from app.services import get_response_from_Etherscan
import time


main = Blueprint("main", __name__)
@main.route("/api/test", methods=["GET"])
def test():
   return jsonify(
      {
         "tesst":[
            "mika"
         ]
      }
   )


@main.route("/api/transactions", methods=["GET"])
def get_transactions_etherscan():
   # address =  "0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f"
   # address = "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98"
   # start_block = 18000000
   address = request.args.get("address")
   start_block = request.args.get("start_block", default=0, type=int)
   end_block = 99999999

   if not address:
      return jsonify({"error": "Address is required"}), 400

   all_data = []
   current_start_block = start_block
   
   data = get_response_from_Etherscan(address, current_start_block, end_block)

   if not data:
      return jsonify({"error": data.get("message", "No Transactions")}), 404

   last_block = int(data[-1]["blockNumber"])
   print(f"usao put, velicina: {start_block} {current_start_block} {last_block} {end_block}")
   current_start_block = last_block

   while data and int(data[-1]["blockNumber"]) == last_block:
      data.pop()

   all_data.extend(data)

   while current_start_block < end_block:
      
      data = get_response_from_Etherscan(address, current_start_block, end_block)

      if not data:
         break

      last_block = int(data[-1]["blockNumber"])
      if len(data) < 10000:
         all_data.extend(data)
         break
      
      while data and int(data[-1]["blockNumber"]) == last_block:
         data.pop()

      all_data.extend(data)

      print(f"usao put, velicina: {start_block} {current_start_block} {last_block} {end_block} {len(all_data)}")

      current_start_block = last_block

      time.sleep(0.2)

   
   return jsonify({
      "wallet_address": address,
      "start_block": start_block,
      "number_of_transactions": len(all_data),
      "blocks": all_data
})
