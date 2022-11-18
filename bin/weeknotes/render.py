#!/usr/bin/env python3

import os
import jinja2

from pathlib import Path
from frontmatter import Frontmatter
from bin.weeknotes.summary import create_summary
from bin.summary import create_summary

from digital_land_frontend.filters import make_link
from digital_land_frontend.markdown.filter import compile_markdown, markdown_filter

output_dir = "docs/weeknote"
url_root = "weeknote"


def get_content_pages(directory):
    return os.listdir(directory)


def markdown_files_only(files, file_ext=".md"):
    return [f for f in files if f.endswith(file_ext)]


def read_content_file(filename, expanded=False):
    content = {}
    # fn = Path(filename)
    file_content = Frontmatter.read_file(filename)

    content["content"] = compile_markdown(file_content["body"])
    content["frontmatter"] = file_content["attributes"]
    content["title"] = (
        file_content["attributes"].get("title")
        if file_content["attributes"].get("title") is not None
        else filename.with_suffix("")
    )
    content["date"] = file_content["attributes"].get("date")
    content["displayDate"] = True
    content["section"] = "Weeknote"

    if expanded:
        content["body"] = file_content["body"]

    return content


def render(path, template, **kwargs):
    # path = os.path.join(output_dir, path)
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)

    with open(path, "w") as f:
        f.write(template.render(**kwargs))


def render_pages(directory, env, parent_dir=""):
    weeknote_template = env.get_template("weeknote.html")
    path_to_directory = os.path.join(parent_dir, directory)
    pages = get_content_pages(path_to_directory)

    for page in pages:
        p = os.path.join(path_to_directory, page)
        if os.path.isdir(p):
            # handle directories
            print(p, "is a directory")
            render_pages(page, path_to_directory)
        elif page.endswith(".md"):
            # compile and render markdown file
            fn = Path(p)
            contents = read_content_file(fn)
            output_path = os.path.join(output_dir, fn.stem, "index.html")
            render(output_path, weeknote_template, content=contents)
        else:
            # TO DO: copy other pages to /docs
            pass


def render_index(weeknote_dir, env):
    index_template = env.get_template("index.html")
    summaries = []
    all = get_content_pages(weeknote_dir)
    weeknotes = markdown_files_only(all)
    for weeknote in sorted(weeknotes, reverse=True):
        path_to_file = os.path.join(weeknote_dir, weeknote)
        fn = Path(path_to_file)
        contents = read_content_file(fn, expanded=True)
        summaries.append(
            create_summary(
                contents,
                fn,
                section=contents["section"],
                displayDate=True,
                date=contents["date"],
            )
        )

    output_path = os.path.join(output_dir, "index.html")
    render(output_path, index_template, summaries=summaries)


def setup(searchpath):
    multi_loader = jinja2.ChoiceLoader(
        [
            jinja2.FileSystemLoader(searchpath=searchpath),
            jinja2.PrefixLoader(
                {
                    "digital-land-frontend": jinja2.PackageLoader(
                        "digital_land_frontend"
                    ),
                    "govuk-jinja-components": jinja2.PackageLoader(
                        "govuk_jinja_components"
                    ),
                }
            ),
        ]
    )
    return jinja2.Environment(loader=multi_loader, autoescape=True)


def render_weeknotes(weeknote_dir):

    current_path = os.path.dirname(os.path.realpath(__file__))
    template_dir = os.path.join(current_path, "templates")
    env = setup(template_dir)

    env.globals["urlRoot"] = url_root
    env.filters["make_link"] = make_link
    env.filters["markdown"] = markdown_filter

    # set variables to make available to all templates
    env.globals["staticPath"] = "https://digital-land.github.io"

    render_pages(weeknote_dir, env)
    render_index(weeknote_dir, env)
