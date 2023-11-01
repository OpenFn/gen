import sys
from pathlib import Path

# Add the path to the root directory of the package to the Python path
PACKAGE_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PACKAGE_ROOT))
