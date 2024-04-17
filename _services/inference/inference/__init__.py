from dotenv import load_dotenv
from pathlib import Path

path = Path(__file__).parent.parent / ".env"
load_dotenv(path)
