# Food Log Parser

This repository contains a minimal parser that converts Korean text logs into structured dictionaries.

## Usage

1. Place a sentence in a text file, e.g. `log.txt` containing:

```
사과 2개 먹었어요
```

2. Run the CLI parser:

```bash
python -m genie_service.functions.food_file_reader log.txt
```

This prints:

```
{'food': 'apple', 'quantity': 2, 'measure': 'unit'}
```

You can also call the parser directly:

```python
from genie_service.functions.food_parser import parse_food_log
parse_food_log('사과 2개 먹었어요')
```

## Development

Run the tests with:

```bash
PYTHONPATH=. pytest genie_service/functions/tests -q
```
