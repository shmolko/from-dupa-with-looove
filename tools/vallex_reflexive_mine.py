#!/usr/bin/env python3
"""Small helper for mining reflexive verb candidates from VALLEX."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


DEFAULT_PATH = Path("data-sources/vallex/vallex-verbs-4.5.json")
PRIMARY_LEMMA_ORDER = ("impf", "pf", "biasp")


def flatten_texts(value: Any) -> list[str]:
    results: list[str] = []

    if isinstance(value, str):
        return [value]

    if isinstance(value, list):
        for item in value:
            results.extend(flatten_texts(item))
        return results

    if isinstance(value, dict):
        if "content" in value and isinstance(value["content"], str):
            results.append(value["content"])
        for key, child in value.items():
            if key in {"__type__", "type", "id"}:
                continue
            results.extend(flatten_texts(child))

    return results


def lemma_forms(lexeme: dict[str, Any], include_iterative: bool = False) -> list[str]:
    lemma_data = lexeme.get("lemma", {}).get("data", {})
    forms = []

    for key in PRIMARY_LEMMA_ORDER:
        value = lemma_data.get(key)
        if isinstance(value, str):
            forms.append(value)

    if include_iterative:
        for key, value in lemma_data.items():
            if key in PRIMARY_LEMMA_ORDER:
                continue
            if isinstance(value, str):
                forms.append(value)

    return forms


def is_reflexive_lemma(lexeme: dict[str, Any]) -> bool:
    return any(" se" in form or " si" in form for form in lemma_forms(lexeme, include_iterative=True))


def reflexive_types(lexeme: dict[str, Any]) -> list[str]:
    types = set()
    for lu in lexeme.get("lexical_units", []):
        for entry in lu.get("reflexverb", {}).get("data", []):
            entry_type = entry.get("type")
            if entry_type:
                types.add(entry_type)
    return sorted(types)


def first_examples(lexeme: dict[str, Any], limit: int = 3) -> list[str]:
    examples: list[str] = []
    for lu in lexeme.get("lexical_units", []):
        raw = lu.get("example", {}).get("data", [])
        for text in flatten_texts(raw):
            cleaned = " ".join(text.split())
            if cleaned and cleaned not in examples:
                examples.append(cleaned)
            if len(examples) >= limit:
                return examples
    return examples


def first_glosses(lexeme: dict[str, Any], limit: int = 3) -> list[str]:
    glosses: list[str] = []
    for lu in lexeme.get("lexical_units", []):
        raw = lu.get("synon", {}).get("data", {})
        for text in flatten_texts(raw):
            cleaned = " ".join(text.split())
            if cleaned and cleaned not in glosses:
                glosses.append(cleaned)
            if len(glosses) >= limit:
                return glosses
    return glosses


def main() -> None:
    parser = argparse.ArgumentParser(description="Inspect reflexive verb candidates in VALLEX.")
    parser.add_argument("--path", default=str(DEFAULT_PATH), help="Path to vallex-verbs-4.5.json")
    parser.add_argument("--query", default="", help="Substring filter on lemma")
    parser.add_argument("--type", default="", help="Filter by reflexive type, e.g. tantum")
    parser.add_argument("--limit", type=int, default=20, help="Maximum number of results")
    parser.add_argument(
        "--include-iterative",
        action="store_true",
        help="Also show iterative/frequentative forms such as bávat se",
    )
    args = parser.parse_args()

    with Path(args.path).open() as handle:
        data = json.load(handle)

    count = 0
    for lexeme in data.get("Lexemes", []):
        forms = lemma_forms(lexeme, include_iterative=args.include_iterative)
        if not is_reflexive_lemma(lexeme):
            continue

        joined = " | ".join(forms)
        if args.query and args.query.lower() not in joined.lower():
            continue

        types = reflexive_types(lexeme)
        if args.type and args.type not in types:
            continue

        count += 1
        print(f"LEMMA: {joined}")
        print(f"ID: {lexeme.get('id', '')}")
        print(f"REFLEXIVE_TYPES: {', '.join(types) if types else '-'}")

        glosses = first_glosses(lexeme)
        if glosses:
            print(f"GLOSSES: {' | '.join(glosses)}")

        examples = first_examples(lexeme)
        if examples:
            print("EXAMPLES:")
            for example in examples:
                print(f"  - {example}")

        print()
        if count >= args.limit:
            break


if __name__ == "__main__":
    main()
