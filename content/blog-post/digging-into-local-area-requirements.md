---
title: "Digging into local area requirements"
date: 2024-01-22
author: "Matt Lucht"
status: beta
section: Data standards
summary: How can local area requirements help shape the priority of our data standards work.
---

Recently we’ve been spending a bit of time looking into local area requirements (also referred to as validation lists, checklists, and a few other names too). We hope that through understanding more about these requirements we’ll be able to better prioritise our work in data standards to support the modern planning software and local plan projects.

## Local area requirements, what are they?

Local area requirements are typically a document (or sometimes a webpage) published by a local planning authority that lists all of the _things_ you’ll need to provide when making a planning application.

The _‘things’_ are usually assessments or reports – such as an [air quality assessment](https://www.gov.uk/guidance/air-quality--3#what-is-the-role-of-plan-making-with-regard-to-air-quality) or a [daylight and sunlight assessment](https://www.camden.gov.uk/daylight-and-sunlight-assessment) – and are required based on certain sets of circumstances. For example, a [heritage statement](https://www.camden.gov.uk/heritage-statements) needs to be provided for any works that affect a [listed building](https://www.planning.data.gov.uk/dataset/listed-building), [locally listed building](https://www.planning.data.gov.uk/dataset/locally-listed-building) or [conservation area](https://www.planning.data.gov.uk/dataset/conservation-area).

As the name suggests, what you need to provide and the circumstances under which you need to provide it can vary from local planning authority to local planning authority.

## Why do we think they’re interesting?

### Triggers and rules

Through analysing the local area requirements we hope to document what planning considerations trigger what [planning requirements](https://digital-land.github.io/data-standards/what-we-are-working-on/planning-consideration/). We can then build up a picture of what considerations occur most frequently and based on that we’re hypothesising that making these available as data would help unlock greater value in the data available on [planning.data.gov.uk](https://planning.data.gov.uk).

### Consultative data

Similar to the triggers, we’re interested in exploring that planning considerations might be needed in order to fulfil a planning requirement. These might be things that help write a report or provide evidence to the outcome of an assessment.

![A sketched diagram showing the relationship between triggers and datasets. Image courtesy of Mike Rose](/images/diagrams/datasets-and-triggers.png)

## What have we learnt so far?

…at this point we ought to mention that we’re not the first people to be looking into this area. We owe a big thank you to Emily Hadley for sharing some work that they did a while back whilst working with [Buckinghamshire Council](https://www.buckinghamshire.gov.uk/) and also Rich and the team at [Camden](https://www.camden.gov.uk/) for sharing an early view of their new local area requirements document.

### How we’re approaching the analysis

We’ve been using [Airtable](https://airtable.com/) as a starting point to help collate all the information. It allows us to easily create lists of things in different tables and then tag or link between them.

We begun by listing all the different planning requirements mentioned by a handful of local planning authorities and against each one recorded:

* the type planning application(s) the requirement related to
* what planning consideration triggered the requirement
* which local planning authority listed the requirement 

![A screen shot of the planning requirement table in Airtable](/images/diagrams/local-area-requirement-analysis.png)

If you’re interested in taking a look at the Airtable you’ll need to create an account and then request read-only access [here](https://airtable.com/invite/l?inviteId=invlRcIOlr5syXxlx&inviteToken=e2ccc363be8acab50ae87948f89560021927bf0310d9e92918391650491c6c14&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts).

### Early days, but we think we’re onto something

So far we’ve gathered information from 9 local planning authorities. Admittedly this is a small sample size but we intend to add to this. But already it's feeling like we’re seeing some useful insights emerge.

For example, we can see that applications that relate to (or are in the proximity of) buildings of a particular use type trigger the most planning requirements. This is closely followed by conservation areas, community facilities, listed buildings and open space.

We can also see that from the sets of local area requirements that we’ve looked at so far that there are 11 planning requirements that are required (in certain circumstances) by all local planning authorities and that there are some planning requirements that are only requirements for certain types of authorities (so far at least).

## Up next...

We’ve a couple of immediate next steps:

* we want to share our approach with colleagues in planning software to see how this approach may help with what they’re doing. We’re also keen to get their take on some of the planning considerations that are emerging from this work
* increase the sample size of local planning requirements so that we can be more confident around emerging findings
* start thinking about an approach for making this information more open and available for others to view and use
* to help with the analysis we gathered a list of local area requirements from all local planning authorities. Its very much a snapshot in time but we plan to publish it as a dataset on planning.data.gov.uk 