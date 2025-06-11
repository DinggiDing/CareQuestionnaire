import unittest
import os
from tempfile import NamedTemporaryFile

from genie_service.functions.food_file_reader import parse_food_file


class TestFoodFileReader(unittest.TestCase):
    def test_parse_file(self):
        with NamedTemporaryFile('w+', delete=False, encoding='utf-8') as f:
            f.write('사과 2개 먹었어요')
            file_path = f.name
        try:
            data = parse_food_file(file_path)
            self.assertEqual(data, {'food': 'apple', 'quantity': 2, 'measure': 'unit'})
        finally:
            os.remove(file_path)


if __name__ == '__main__':
    unittest.main()
