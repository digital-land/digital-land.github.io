---
title: "Versioning our standards"
date: 2023-09-13
author: "Colm Britton"
status: beta
summary: Read about why and how we have added versioning to our specifications and dataset definitions.
---

[Our standards](https://digital-land.github.io/specification/specification/) are living documents that change over time. They change as the needs of data consumers change and as we learn more about how the data will be used.

So far, we haven’t done a good job of recording what has changed, when it changed and why.

When we make a change, our technical specifications are updated but it’s not immediately obvious to users that something has changed.

## What happens when we make changes

Once our standards are out of the ‘working draft’ stage changes are made slowly and deliberately.

We try not to introduce any changes that may break things and we publish the proposed changes on the relevant [github discussion](https://github.com/digital-land/data-standards-backlog/discussions/) before finalising them.

The platform will continue to collect data published to old versions of a standard and if there have been any changes to existing fields then the platform will try to map the existing data to the newer shape.

## Changes we want to record

There are 2 things that can change in our standards; our definition of a dataset (or schema) and our specifications. 

**A dataset definition** sets out the shape of a dataset and includes the list of fields that each record will have once it’s available on [planning.data.gov.uk](https://www.planning.data.gov.uk/).

We want to record changes to the list of fields - we add, remove and edit these - and any associated descriptions or guidance.

**A specification** is where we define what datasets and fields we want data publishers to provide for a planning consideration.

We want to record changes to the constituent datasets, the list of fields per dataset and the field descriptions.

## What we've done

### Added version numbers

We’ve introduced semantic version numbers.

Dataset definitions now have version numbers with 2 parts, for example: 2.1. 

If we make a change to the fields we bump the major number (for example, 3.1), and if we change descriptions or guidance we update the minor number (for example, 2.2).

Specifications now have version numbers with 3 parts, for example: 1.2.1. 

If we make a change to the datasets in a specification we update the major number (for example: 2.2.1), if we change the fields in a dataset we update the minor number (for example: 1.3.1), and if we change descriptions we update the patch number (for example: 1.2.2).

![An image showing the semantic version numbering. Under the heading dataset schemas it has 1.2. There is an arrow pointed at the 1 saying "Changes to fields" and an arrow pointing to the 2 labelled "changes to description/guidance. Under the heading Specification there is 1.5.2. An arrow is point at the 1 labelled "changes to datasets", an arrow pointed at the 5 labelled "changes to fields, and an arrow pointed at the 2 labelled "changes to descriptions.](/static/images/diagrams/data-standards-versioning-convention.jpg)

### Kept old versions of technical specifications

We still generate static pages from our specification configuration files, but now we include the version number on the page and keep copies of the old versions.

The latest version for a specification is still available from the same place. For example the latest version of the conservation-area specification can be found at [https://digital-land.github.io/specification/specification/conservation-area/](https://digital-land.github.io/specification/specification/conservation-area/)

This page links to all previous versions of the specification, with each version available at `/{specification-name}/v{version-number}`. For example, the previous version of the conservation-area specification can be found at [https://digital-land.github.io/specification/specification/conservation-area/v1.1.1/](https://digital-land.github.io/specification/specification/conservation-area/v1.1.1/)

### Logged the fields that belong to each version of a dataset

When the specification repository with all the specification and dataset configuration files is processed, we now output [a csv file containing a breakdown of which fields belong to each version of a dataset](https://github.com/digital-land/specification/blob/main/specification/dataset-field-version.csv).

For example, if a `name` field is present in both versions of the conservation-area dataset then there will be 2 rows in this file, one for version 1 and one for version 2.

And, if a `designated-date` field is added to the second version of the conservation-area dataset then there will be one row in this file that states version 2 of conservation-area has a `designation-date` field.

## Who needs versions

Adding versioning to our specifications and dataset definitions helps us track what we change over time and our hope is it will make it easier for our users to interact with them.

The users it should help include:

* **Data providers** - when data provides create and publish data that follows our standards they will know what version they are following. When new versions are released it will be easier for them to know something has changed and what they need to do to bring their data inline with the latest version.
* **The platform operations team** - when processing the collected data it will be easier for the planning data platform to provide data that matches the latest definition of a dataset. And if the need arises, then versioning gives them the option to provide data to consumers that conforms with a particular version of the standard.
* **Software providers** - when they are asked to provide software that conforms to a standard they will know what version of the technical specification they should use. And when they are asked to bring software inline with a newer version of the specification it will be easier for them to determine what they need to change.

## What’s next

We’ve been holding off making changes to some of our existing standards. Now we can make them. This week we plan to publish changes to the [article-4-direction](https://digital-land.github.io/specification/specification/article-4-direction/), [conservation-area](https://digital-land.github.io/specification/specification/conservation-area/) and [tree-preservation-order](https://digital-land.github.io/specification/specification/tree-preservation-order/) specifications.

We now keep different versions of the technical specification pages, along with the accompanying specification configuration file and relational diagram. This is a good first step.

However, we now need to make it easier to see what has changed between the different versions. We are working on a ‘changelog’ page that will outline what has changed between each of the different versions of a specification.
