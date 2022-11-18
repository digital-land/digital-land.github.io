#!/usr/bin/env python3

import os
import markdown

from frontmatter import Frontmatter

from bin.projects.jinja_setup import setup, render
from digital_land_frontend.filters import make_link
from digital_land_frontend.markdown.govukify import govukify

from markdown.extensions.toc import TocExtension

# init markdown
md = markdown.Markdown(extensions=[TocExtension(toc_depth="2-3")])


def compile_markdown(md, s):
    html = md.convert(s)
    return govukify(html)


# making markdown compiler available to jinja templates
def markdown_filter(s):
    return compile_markdown(md, s)


def get_project_content(filename):
    file_content = Frontmatter.read_file(filename)
    return {
        "name": file_content["attributes"].get("title"),
        "status": file_content["attributes"].get("status"),
        "description": file_content["attributes"].get("one-liner"),
        "frontmatter": file_content["frontmatter"],
        "body": file_content["body"],
    }


def markdown_files_only(files, file_ext=".md"):
    return [f for f in files if f.endswith(file_ext)]


# get empty project buckets
summary = {
    "in progress": {
        "description": "Projects we have started to investigate. We have begun understanding the planning related user needs and collecting data where data is being created.",
        "projects": [],
    },
    "ongoing": {
        "description": "Projects we haved worked on that are ongoing. This means they are still ticking along in the background but they are not currently our primary focus.",
        "projects": [],
    },
    "backlog": {
        "description": "Areas, impacting planning, where we believe there is useful data to find and publish.\n\nWe will investigate each area to understand the users and their needs in the context of planning, and make sure any relevant data can be published and used by the BOPS and RIPA projects.",
        "projects": [],
    },
    "completed": {
        "description": "Projects that we have finished. These are time boxed projects that have a clear start and end, such as a discovery into a policy area.",
        "projects": [],
    },
    "finished": {
        "description": "Projects we have stopped working on and do not expect to return to. The project may no longer be relevant or we have learnt something that has changed our view of the project.",
        "projects": [],
    },
}


def add_to_bucket(project_path, project):
    # don't add to bucket if redirected to another URL
    if project.get("redirect") is None:
        summary.setdefault(project.get("status").lower(), {"projects": []})
        # make the summary obj
        project_summary = {
            "path": project_path,
            "name": project.get("name"),
            "description": project.get("description"),
        }
        # append to correct bucket
        summary[project.get("status").lower()]["projects"].append(project_summary)


def render_project_content_pages(content_template, project_dir, project):
    content_dir = f"{project_dir}/{project}/content"
    md_files = markdown_files_only(os.listdir(content_dir))
    for f in md_files:
        file_content = Frontmatter.read_file(f"{content_dir}/{f}")
        html = compile_markdown(md, file_content["body"])
        render(
            f"{project}/{f.replace('.md', '')}/index.html",
            content_template,
            content=html,
            toc=md.toc_tokens,
            fm=file_content["attributes"],
            project=project,
        )


def get_update_content(filename):
    file_content = Frontmatter.read_file(filename)
    return {
        "name": file_content["attributes"].get("name"),
        "type": file_content["attributes"].get("type"),
        "date": file_content["attributes"].get("date"),
        "frontmatter": file_content["frontmatter"],
        "body": file_content["body"],
    }


def collect_updates(project_folder):
    updates_dir = f"{project_folder}/updates"
    if not os.path.isdir(updates_dir):
        return []

    md_files = markdown_files_only(os.listdir(updates_dir))
    return [get_update_content(f"{updates_dir}/{f}") for f in md_files]


# loop each project
# loop over additional content files
# extract frontmatter
# compile markdown
# render

# get index md
# extract frontmatter
# process frontmatter
# compile markdown
# loop over updates
# extract frontmatter
# compile markdown
# render project page


def render_projects(project_dir):

    current_path = os.path.dirname(os.path.realpath(__file__))
    template_dir = os.path.join(current_path, "templates")
    env = setup(template_dir)

    # register jinja filters
    env.filters["make_link"] = make_link

    # set variables to make available to all templates
    env.globals["staticPath"] = "https://digital-land.github.io"

    env.filters["markdown"] = markdown_filter

    # get templates
    index_template = env.get_template("index.html")
    project_template = env.get_template("project.html")
    content_template = env.get_template("content.html")
    design_history_template = env.get_template("design-history.html")

    projects = os.listdir(project_dir)
    for project in projects:

        # render any additional content pages
        if os.path.isdir(f"{project_dir}/{project}/content"):
            render_project_content_pages(content_template, project_dir, project)

        project_content = get_project_content(f"{project_dir}/{project}/index.md")

        # add to buckets for index
        add_to_bucket(project, project_content)

        # collect any additional updates
        updates = collect_updates(f"{project_dir}/{project}")

        render(
            f"{project}/index.html",
            project_template,
            project=project_content,
            artefacts=project_content.get("artefacts"),
            updates=sorted(updates, key=lambda x: x["date"], reverse=True),
        )
    for k in summary.keys():
        summary[k]["projects"].sort(key=lambda x: x["name"])
    # generate index page
    render(f"index.html", index_template, projects=summary)


if __name__ == "__main__":
    render_projects("content/project")
