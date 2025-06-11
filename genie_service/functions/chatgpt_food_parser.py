import json
from typing import List, Dict

try:
    import openai  # type: ignore
except Exception:  # pragma: no cover - openai may not be installed in tests
    openai = None

SYSTEM_PROMPT = (
    "음식 섭취 문장을 받아서 {\"food\": <음식>, \"count\": <숫자>} 형식의 JSON만 반환해 주세요."
)


def _require_openai():
    if openai is None:
        raise ImportError("openai package is required to use this function")


def parse_food_with_chatgpt(text: str) -> Dict[str, object]:
    """Parse a single sentence describing food intake using ChatGPT."""
    _require_openai()
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": text},
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0,
    )
    return json.loads(response.choices[0].message.content)


def parse_food_list_to_json(sentences: List[str], path: str) -> None:
    """Parse multiple sentences and save the result to a JSON file."""
    data = [parse_food_with_chatgpt(s) for s in sentences]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":  # pragma: no cover - manual usage helper
    import sys

    if len(sys.argv) < 3:
        print("Usage: python -m chatgpt_food_parser '<sentence1>' '<sentence2>' ... <out_file>")
        sys.exit(1)
    *sentences, out_file = sys.argv[1:]
    parse_food_list_to_json(sentences, out_file)
    print(f"Saved results to {out_file}")
