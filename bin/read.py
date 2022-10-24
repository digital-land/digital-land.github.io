#!/usr/bin/env python3

from digital_land_frontend.markdown.content_file import read_content_file


def read_file(filename, expanded=False, **kwargs):
    content = read_content_file(filename, expanded, **kwargs)

    content
    return content
