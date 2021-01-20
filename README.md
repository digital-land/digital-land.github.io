# Digital land

This repo renders the [main (and some small) sections on the digital land site](https://digital-land.github.io/).

## Working with repo

Install dependencies (we recommend working in a virtualenv)

    make init

Render pages

    make render

### Helpful frontmatter properties

**`external_url`** - add a url to an external source. The page will redirect to this url. Useful if blog posts are hosted on another domain.

**`show_summaries`** - default False. Set to True if you'd like the list page to preview the content pages. The summary for each will be either the first sentence or the `summary` set in the page frontmatter.

**`sort_by`** - option to decide what frontmatter property to order the list by. Defaults to the title of each content page. Need to provide the following

* `sort_by.field` - the name of the field to sort on, e.g. _date_
* `sort_by.reverse` - (optional - defaults to false), set to True if want the list in reverse order 

**`template`** - put the name of a different template to use. This template should exist in the `templates/layouts` directory.

**`pageTitle`** - the page title set in the document head will default to `<title of content> - Digital Land`. Set `pageTitle` in the frontmatter to override.
