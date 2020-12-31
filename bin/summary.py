#!/usr/bin/env python3


def first_sentence(s):
    sentences = s.split(".")
    if len(sentences) > 0:
        summary = sentences[0].strip("_").strip()
        if len(summary) > 0:
            return summary + "."
        return summary
    return s


def create_summary(file_contents, fn, **kwargs):
    summary = {}
    summary["title"] = file_contents["title"]
    summary["url"] = fn.stem
    summary["summary"] = (
        file_contents["frontmatter"].get("summary")
        if file_contents["frontmatter"].get("summary") is not None
        else first_sentence(file_contents["body"])
    )
    return {**summary, **kwargs}
