import re
from typing import Dict

TRANSLATION = {
    "사과": "apple",
    "바나나": "banana",
    "우유": "milk",
}

MEASURE_MAP = {
    "개": "unit",
    "잔": "cup",
    "ml": "ml",
    "그램": "g",
    "g": "g",
}

PATTERN = re.compile(r"(?P<food>\S+)\s+(?P<quantity>[0-9]+(?:\.[0-9]+)?)\s*(?P<measure>\S+)")

def parse_food_log(text: str) -> Dict[str, object]:
    match = PATTERN.search(text)
    if not match:
        raise ValueError(f"Cannot parse input: {text}")
    food = match.group('food')
    quantity = float(match.group('quantity'))
    if quantity.is_integer():
        quantity = int(quantity)
    measure = match.group('measure')
    return {
        "food": TRANSLATION.get(food, food),
        "quantity": quantity,
        "measure": MEASURE_MAP.get(measure, measure)
    }

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python -m food_parser '<text>'")
        sys.exit(1)
    result = parse_food_log(sys.argv[1])
    print(result)
