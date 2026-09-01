import pytest


def test_extract_txt():
    from app.routers.documents import extract_text
    content = b"Hello, this is a test document."
    result = extract_text(content, "test.txt")
    assert result == "Hello, this is a test document."


def test_extract_txt_empty():
    from app.routers.documents import extract_text
    content = b""
    result = extract_text(content, "test.txt")
    assert result == ""


def test_extract_unsupported():
    from app.routers.documents import extract_text
    with pytest.raises(Exception):
        extract_text(b"binary", "test.doc")
