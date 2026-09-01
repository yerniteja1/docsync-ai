import pytest
from app.embeddings import chunk_text


def test_chunk_text_basic():
    text = " ".join(["word"] * 100)
    chunks = chunk_text(text)
    assert len(chunks) > 0
    assert all(isinstance(c, str) for c in chunks)


def test_chunk_text_short():
    text = "Hello world"
    chunks = chunk_text(text)
    assert len(chunks) == 1
    assert chunks[0] == "Hello world"


def test_chunk_text_empty():
    chunks = chunk_text("")
    assert chunks == []


def test_chunk_text_overlap():
    text = " ".join(["word"] * 600)
    chunks = chunk_text(text)
    assert len(chunks) > 1


def test_chunk_text_preserves_order():
    words = [f"word{i}" for i in range(20)]
    text = " ".join(words)
    chunks = chunk_text(text)
    for chunk in chunks:
        for word in chunk.split():
            assert word.startswith("word")
