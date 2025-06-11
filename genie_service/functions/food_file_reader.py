import sys
from typing import Dict
from .food_parser import parse_food_log


def parse_food_file(path: str) -> Dict[str, object]:
    """Read a food log from a file and parse it."""
    with open(path, "r", encoding="utf-8") as f:
        text = f.read().strip()
    return parse_food_log(text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python -m food_file_reader <file_path>")
        sys.exit(1)
    result = parse_food_file(sys.argv[1])
    print(result)
