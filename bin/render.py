#!/usr/bin/env python3

import os

from digital_land_frontend.jinja import setup_jinja
from digital_land_frontend.filters import make_link
from digital_land_frontend.markdown.filter import markdown_filter
from digital_land_frontend.markdown.content_file import create_breadcrumbs


class Renderer:
    def __init__(self, url_root=""):
        self.env = setup_jinja()
        self.env.globals["urlRoot"] = url_root
        self.env.filters["make_link"] = make_link
        self.env.filters["markdown"] = markdown_filter

    def get_env(self):
        return self.env

    def get_template(self, path):
        if not path.endswith(".html"):
            path = path + ".html"
        return self.env.get_template(path)

    def set_global(self, name, value):
        self.env.globals[name] = value

    @staticmethod
    def render(path, template, **kwargs):
        directory = os.path.dirname(path)
        if not os.path.exists(directory):
            os.makedirs(directory)

        with open(path, "w") as f:
            f.write(template.render(**kwargs))

    def render_content_page(self, output_path, template, page_content, **kwargs):
        # check to see if author has set a template
        if page_content["frontmatter"].get("template") is not None:
            template_name = page_content["frontmatter"].get("template")
            template_path = os.path.join("layouts", template_name)
            try:
                template = self.get_template(template_path)
            except Exception as e:
                print(e)

        self.render(
            output_path,
            template,
            breadcrumbs=create_breadcrumbs(output_path),
            pageContent=page_content,
            **kwargs
        )
