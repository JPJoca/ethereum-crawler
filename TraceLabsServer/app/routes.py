from flask import Blueprint, request, jsonify
from app.services import get_txlist_from_Etherscan, \
   get_getblocknobytime_from_Etherscan, get_balance
import time
from datetime import datetime, timezone


main = Blueprint("main", __name__)

@main.route("/api/timestamp", methods=["GET"])
# We can't see all the blocks on a specific date bcs of the slow api.
# So the code to that is commented
# We will use only at 00:00:00 UTC
def get_block_by_date():
   date_str = request.args.get('dateStart')
   address = request.args.get("address")

   print(date_str)
   try:
      start_ts = int(datetime.fromisoformat(date_str.replace("Z", "")).replace(tzinfo=timezone.utc).timestamp())
      # end_ts = int(datetime.fromisoformat(date_end.replace("Z", "")).replace(tzinfo=timezone.utc).timestamp())

   except ValueError:
      return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

   start_block = get_getblocknobytime_from_Etherscan(start_ts, closest="before")
   # end_block = get_getblocknobytime_from_Etherscan(end_ts, closest="after")

   balance_eth = get_balance(address, start_block)

   # for i in range(start_block, end_block):
   #    balance_eth += get_balance(address, i)
   #    print(balance_eth)

   return jsonify({
      "startBlock": start_block,
      "date": date_str,
      "balance": round(balance_eth, 8),
      "address": address
   })

@main.route("/api/transactions", methods=["GET"])
def get_transactions_etherscan():
   address = request.args.get("address")
   start_block = request.args.get("start_block", default=0, type=int)
   end_block = 99999999

   if not address:
      return jsonify({"error": "Address is required"}), 400

   all_data = []
   current_start_block = start_block

   data = get_txlist_from_Etherscan(address, current_start_block, end_block)

   if not data:
      return jsonify({"error": data.get("message", "No Transactions")}), 404

   last_block = int(data[-1]["blockNumber"])
   # print(f"usao put, velicina: {start_block} {current_start_block} {last_block} {end_block}")
   current_start_block = last_block

   while data and int(data[-1]["blockNumber"]) == last_block:
      data.pop()

   all_data.extend(data)

   while current_start_block < end_block:
      data = get_txlist_from_Etherscan(address, current_start_block, end_block)

      if not data:
         break

      last_block = int(data[-1]["blockNumber"])
      if len(data) < 10000:
         all_data.extend(data)
         break

      while data and int(data[-1]["blockNumber"]) == last_block:
         print("Tekila shots")
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
