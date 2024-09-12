---
title: "How we store data from local planning authorities and keep it up to date"
date: 2024-08-14
author: "Greg Slater"
status: beta
section: Planning data
summary: An overview of the data model used by planning.data.gov.uk and the benefits it brings to our users.
---


The planning data platform collects data from a diverse range of sources. How we store and manage this data once it’s been collected is fundamental to our vision of making land and housing data easier to find, use and trust.

The data model used by the platform is based on the concept of a [named graph](https://en.wikipedia.org/wiki/Named\_graph). This means that we can create globally unique identifiers (URIs) for the things that we hold information about. For example, this Article 4 direction area in Barnet can be identified as: [https://www.planning.data.gov.uk/entity/7010002551](https://www.planning.data.gov.uk/entity/7010002551). We refer to this Article 4 direction area as an “entity”, i.e. a distinct thing. Each distinct thing we hold data about is its own entity with its own unique identifier, and each entity essentially acts as a container for all the pieces of information we gather about it.

This model has advantages:

* We can use a single data model to store data from a huge range of different sources, and about lots of different things  
* We can combine data from different providers who publish information about the same things  
* We can keep a record of the provenance for all the pieces of data we collect

This provides benefits for our users:

* They can access a huge range of data using [consistent methods](https://www.planning.data.gov.uk/docs), whether they’re interested in [tree preservation zones in Southwark](https://www.planning.data.gov.uk/entity/?dataset=tree-preservation-zone&geometry_curie=statistical-geography%3AE09000028&entry_date_day=&entry_date_month=&entry_date_year=), or [public transport access nodes in Bolton](https://www.planning.data.gov.uk/entity/?dataset=transport-access-node&geometry_curie=statistical-geography%3AE08000001)  
* They can always interrogate the provenance of the data they’re interested in, helping to improve their trust in it  
* They can use a unique and persistent identifier to make reliable references to the same thing across different systems, for example, from our platform to planning services like [PlanX](https://www.planx.uk/)

Let’s run through how we collect open data published by a local planning authority to create an entity on our platform, explaining the model that we use to store this data throughout that process. We’ll use the Barnet Article 4 direction area entity as an example to follow the process from beginning to end.

## Endpoint and resources

We ask local planning authorities to [publish open data on their website](https://www.planning.data.gov.uk/guidance/publish-data-on-your-website) using a publicly accessible URL, which we refer to as an “endpoint”. Once an endpoint is added to our data processing pipeline it will be checked each night for the latest data. When an endpoint is added for the first time we take a copy of the data; this unique copy is referred to as a “resource”. If the pipeline detects any changes in the data, no matter how small, we save a new version of the entire dataset, saving this copy as a new resource. Each separate resource gets given a unique reference which we can use to identify it.

This URL is the endpoint Barnet have provided for their Article 4 direction area data: 

[https://open.barnet.gov.uk/download/e5l77/dhv/article4-direction-areas.csv](https://open.barnet.gov.uk/download/e5l77/dhv/article4-direction-areas.csv) 

You can follow the link yourself to see the CSV file that Barnet have used to share their data.

This [query](https://datasette.planning.data.gov.uk/digital-land?sql=SELECT+%0D%0A++name%2C+%0D%0A++collection%2C+%0D%0A++pipeline%2C+%0D%0A++endpoint\_url%2C+%0D%0A++resource%2C+%0D%0A++endpoint\_entry\_date%2C+%0D%0A++endpoint\_end\_date%2C+%0D%0A++resource\_start\_date%2C+%0D%0A++resource\_end\_date+%0D%0AFROM+reporting\_historic\_endpoints+%0D%0AWHERE+%0D%0A+++organisation+%3D+%22local-authority-eng%3ABNE%22+%0D%0A+++AND+pipeline+%3D+%22article-4-direction-area%22) in datasette – a tool we use to explore the datasets produced by our pipeline – shows the IDs for each of the resources which have been collected from this endpoint, each a unique hash code with a start-date and end-date which record when the resource was first collected (start-date), and when it was superseded by a new resource (end-date). The most recently collected resource has no end-date, as hasn’t yet been replaced by any new data.

## Resources and facts

Each resource contains a lot of data, and we record this data in a way which means we build up a record of all the information that has ever appeared on an endpoint, as well as tracking when it appeared. This provides a valuable record of any changes made to the data.

The data from each resource is saved as a series of “facts”. If we imagine a resource as a table of data, like the CSV file from Barnet, then each combination of entry (row) and field (column) generates a separate fact: a record of the value for that entry and field.

Using Barnet’s article 4 direction area endpoint from above as an example, here is how the first two rows look for the `reference` and `name` fields:

| reference | name |
| :---- | :---- |
| A4D1A1 | Article 4(2) for Finchley Church End CA Area 1 |
| A4D1A2 | Article 4(2) for Finchley Church End CA Area 2 |

This snippet of the full table contains 2 entries and 2 fields, meaning there are a total of 4 facts. Each fact gets given a unique identifier in the same way the resource does. You can see how these facts appear in our [data](https://datasette.planning.data.gov.uk/article-4-direction-area?sql=SELECT+%0D%0A++fr.resource%2C+%0D%0A++fr.entry\_number%2C+%0D%0A++f.fact%2C+%0D%0A++f.field%2C+%0D%0A++f.value%0D%0AFROM+fact\_resource+fr%0D%0AINNER+JOIN+fact+f+on+fr.fact+%3D+f.fact%0D%0AWHERE+%0D%0A+++resource+%3D+%222702f238b05ec028cbd33738b718a81ba9fc70680f1e6f313a000980989a96ec%22%0D%0A+++AND+field+in+%28%22reference%22%2C+%22name%22%29%0D%0A+++AND+fr.entry\_number+%3C%3D+2%0D%0A%0D%0A).

So a table with 10 rows and 10 columns would generate 100 facts. And each time data changes on an endpoint, all of the facts from the new resource are recorded again. We can use these records to trace back through the history of data from an endpoint.

## Entities

Entities are important as they’re the things that actually end up being displayed on the website, in maps, and in planning services using our data. We create new entities when we add an endpoint for the first time, usually creating one for each unique record in a resource. We ask that data providers share data with a unique reference field so that we can record the relationship between our entity numbers and the reference that the data provider uses to refer to that entity.

Once that record of the relationship between the data provider, their reference value, and our entity number is created, the entity will hold all of the facts from entries with that same reference value that have ever been generated from relevant resources. The value displayed for each field on the web page for an entity is always from the most recently updated fact.

Using our example Barnet Article 4 direction area entity we can see the information we’ve captured as facts represented on the [entity web page](https://www.planning.data.gov.uk/entity/7010002551\#).

![A screengrab of the entity page for our example Barnet Article 4 direction area on planning.data.gov.uk](/images/entity_page_7010002551.png)

The Facts links on the right allow users to explore the provenance of each field and value through the facts that we’ve collected. Following the [Facts link](https://www.planning.data.gov.uk/fact/?dataset=article-4-direction-area\&entity=7010002551\&field=name) for the `name` field of this entity shows that the value was initially “*Article 4 Agricultural Land Restriction (1952) Area 1*”, but this was superseded by a new fact on 17/07/2024 with a value of “*Article 4 Agricultural Land Restriction Area 1*”. 

![A screengrab of the fact page of the name field for our example Barnet Article 4 direction area on planning.data.gov.uk](/images/fact_page_7010002551_name.png)

The [link to this individual fact](https://www.planning.data.gov.uk/fact/b1fe5cdcec6d7f478338a7a5216b079a38d2e7745b6d79a67dbf1e85bf7c0293?dataset=article-4-direction-area) will show us the resources that this was captured from.

So there you have it\! We’ve traced the journey from an endpoint through resources and facts to the entities that end up on the platform, and how this system helps us record the provenance of the data that we hold.


_Credits: Swati Dash (Data Governance Manager), Steve Messer (Strategic Product Lead), Owen Eveleigh (Tech Lead), Paul Downey (Service Owner)._
