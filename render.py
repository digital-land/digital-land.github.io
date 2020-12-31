#!/usr/bin/env python3

import os
import sys

from pathlib import Path
from shutil import copyfile

from frontmatter import Frontmatter

from bin.render import Renderer
from bin.list import create_list
from bin.summary import create_summary

from digital_land_frontend.jinja import setup_jinja
from digital_land_frontend.filters import make_link
from digital_land_frontend.markdown.filter import markdown_filter
from digital_land_frontend.markdown.content_file import read_content_file


output_dir = "docs"
content_dir = "content"
url_root = ""

# setup jinja
jinja_renderer = Renderer(url_root)

content_template = jinja_renderer.get_template("content.html")
list_template = jinja_renderer.get_template("list.html")


def get_content_pages(directory):
    return os.listdir(directory)


def markdown_files_only(files, file_ext=".md"):
    return [f for f in files if f.endswith(file_ext)]


def create_output_path(fn, parent_dir=""):
    if fn.stem == "index" or fn.stem == "_index":
        return os.path.join(output_dir, parent_dir, "index.html")
    return os.path.join(output_dir, parent_dir, fn.stem, "index.html")


def render_pages(parent_dir=""):
    path_to_directory = os.path.join(content_dir, parent_dir)

    pages = get_content_pages(path_to_directory)

    for page in pages:
        p = os.path.join(path_to_directory, page)
        if os.path.isdir(p):
            # handle directories
            print(p, "is a directory")
            render_pages(os.path.join(parent_dir, page))
        elif page.endswith(".md"):
            if page == "_list.md":
                list = create_list(pages, path_to_directory)
                output_path = os.path.join(output_dir, parent_dir, "index.html")
                jinja_renderer.render_content_page(output_path, list_template, list)
            else:
                # compile and render markdown file
                fn = Path(p)
                contents = read_content_file(fn)
                output_path = create_output_path(fn, parent_dir)
                jinja_renderer.render_content_page(
                    output_path, content_template, contents
                )
        else:
            # copy other pages to /docs
            print("Moving: ", p, os.path.join(output_dir, parent_dir, page))
            copyfile(p, os.path.join(output_dir, parent_dir, page))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--local":
        jinja_renderer.set_global("staticPath", "")

    render_pages()
