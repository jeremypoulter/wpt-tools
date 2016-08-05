from ..sourcefile import SourceFile

def create(filename, contents=b""):
    return SourceFile("/", filename, "/", contents=contents)


def items(s):
    return [
        (item.item_type, item.url)
        for item in s.manifest_items()
    ]


def test_name_is_non_test():
    non_tests = [
        ".gitignore",
        ".travis.yml",
        "MANIFEST.json",
        "tools/test.html",
        "resources/test.html",
        "common/test.html",
        "conformance-checkers/test.html",
    ]

    for rel_path in non_tests:
        s = create(rel_path)
        assert s.name_is_non_test

        assert items(s) == []


def test_name_is_manual():
    manual_tests = [
        "html/test-manual.html",
        "html/test-manual.xhtml",
    ]

    for rel_path in manual_tests:
        s = create(rel_path)
        assert not s.name_is_non_test
        assert s.name_is_manual

        assert items(s) == [("manual", "/" + rel_path)]


def test_worker():
    s = create("html/test.worker.js")
    assert not s.name_is_non_test
    assert not s.name_is_manual
    assert not s.name_is_multi_global
    assert s.name_is_worker
    assert not s.name_is_reference

    assert items(s) == [("testharness", "/html/test.worker")]


def test_multi_global():
    s = create("html/test.any.js")
    assert not s.name_is_non_test
    assert not s.name_is_manual
    assert s.name_is_multi_global
    assert not s.name_is_worker
    assert not s.name_is_reference

    assert items(s) == [
        ("testharness", "/html/test.any.html"),
        ("testharness", "/html/test.any.worker"),
    ]


def test_testharness():
    s = create("html/test.html", b"<script src=/resources/testharness.js></script>")
    assert not s.name_is_non_test
    assert not s.name_is_manual
    assert not s.name_is_multi_global
    assert not s.name_is_worker
    assert not s.name_is_reference

    assert s.content_is_testharness

    assert items(s) == [("testharness", "/html/test.html")]


def test_relative_testharness():
    s = create("html/test.html", b"<script src=../resources/testharness.js></script>")
    assert not s.name_is_non_test
    assert not s.name_is_manual
    assert not s.name_is_multi_global
    assert not s.name_is_worker
    assert not s.name_is_reference

    assert not s.content_is_testharness

    assert items(s) == []