from dotenv import load_dotenv
from pathlib import Path
import sys

# Add the path to the root directory of the package to the Python path
PACKAGE_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PACKAGE_ROOT))


path = Path(__file__).parent.parent / ".env"
load_dotenv()
