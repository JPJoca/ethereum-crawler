import os 
from dotenv import load_dotenv

load_dotenv()

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
INFIURA_API_KEY = os.getenv("INFURA_API_KEY")
