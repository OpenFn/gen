import sys
from pathlib import Path
from dotenv import load_dotenv

# Add the path to the root directory of the package to the Python path
PACKAGE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PACKAGE_ROOT))

env = PACKAGE_ROOT / ".env"
load_dotenv(env)
