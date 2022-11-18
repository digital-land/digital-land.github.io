#!/usr/bin/env python3

import os
import jinja2

# output directory
docs = "docs/project"


def render(path, template, **kwargs):
    path = os.path.join(docs, path)
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)

    with open(path, "w") as f:
        f.write(template.render(**kwargs))


# register templates
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
