import json
import os
import unittest
from tempfile import NamedTemporaryFile
from unittest.mock import MagicMock, patch

from genie_service.functions.chatgpt_food_parser import (
    parse_food_with_chatgpt,
    parse_food_list_to_json,
)


class TestChatGPTFoodParser(unittest.TestCase):
    @patch("genie_service.functions.chatgpt_food_parser.openai")
    def test_parse_food_with_chatgpt(self, mock_openai):
        mock_openai.ChatCompletion.create.return_value = MagicMock(
            choices=[MagicMock(message=MagicMock(content='{"food": "apple", "count": 1}'))]
        )
        result = parse_food_with_chatgpt("사과 1개를 먹었어요")
        self.assertEqual(result, {"food": "apple", "count": 1})

    @patch("genie_service.functions.chatgpt_food_parser.parse_food_with_chatgpt")
    def test_parse_food_list_to_json(self, mock_parse):
        mock_parse.side_effect = [
            {"food": "apple", "count": 1},
            {"food": "fish", "count": 1},
        ]
        with NamedTemporaryFile("r+", delete=False) as f:
            out_path = f.name
        try:
            parse_food_list_to_json([
                "사과 1개를 먹었어요",
                "갈치구이를 먹었어요",
            ], out_path)
            with open(out_path, "r", encoding="utf-8") as fp:
                data = json.load(fp)
            self.assertEqual(
                data,
                [{"food": "apple", "count": 1}, {"food": "fish", "count": 1}],
            )
        finally:
            os.remove(out_path)


if __name__ == "__main__":
    unittest.main()
