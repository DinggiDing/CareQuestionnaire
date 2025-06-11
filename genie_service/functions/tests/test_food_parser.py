import unittest
from genie_service.functions.food_parser import parse_food_log

class TestFoodParser(unittest.TestCase):
    def test_apple_units(self):
        data = parse_food_log('사과 2개 먹었어요')
        self.assertEqual(data, {'food': 'apple', 'quantity': 2, 'measure': 'unit'})

    def test_banana_units(self):
        data = parse_food_log('바나나 3개 먹었어요')
        self.assertEqual(data, {'food': 'banana', 'quantity': 3, 'measure': 'unit'})

    def test_milk_ml(self):
        data = parse_food_log('우유 200ml 마셨어요')
        self.assertEqual(data, {'food': 'milk', 'quantity': 200, 'measure': 'ml'})

if __name__ == '__main__':
    unittest.main()
