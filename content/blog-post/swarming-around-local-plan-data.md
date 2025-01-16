---
title: "Swarming around local plan data"
date: 2025-01-16
author: "Mark Owen"
status: beta
section: Data standards
summary: Collaborating to check, validate and publish local plan data.
---

Local plans are crucial documents that shape development in a local area. However creating and accessing these plans can be a time-consuming and challenging process.

Currently only around [a third of local authorities have adopted a local plan within the last 5 years](https://media.localdigital.gov.uk/uploads/2023/10/17091341/DLUHC_Digital_Planning_Programme_Overview.pdf). This makes it harder for planners to make informed decisions quickly and for communities to understand what development is proposed in their area. The data in an area’s local plan is also often presented differently by each Local Planning Authority (LPA). 

The Digital Planning Programme at the Ministry of Housing, Communities and Local Government (MHCLG) is transforming how local plans are created, to speed up plan-making and provide better access to planning data. 

Part of our work includes transforming how all local plans for England can be easily accessed and shared by making them all available in one place.

To achieve this the data design team has been looking at what data is available, in what form and how it can be collected by the [Planning Data Platform](https://www.planning.data.gov.uk/). 

By providing the right data for everyone to access we can unlock the potential in the planning system. Enabling our users to build services, develop new policies that enable planners, local authorities and communities to access and use planning information more effectively.

## A local plan specification   
In order to collate all of the existing local plans in England, from different LPAs, the team [developed a specification for local plans](https://digital-land.github.io/specification/specification/local-plan/) which could standardise and streamline how we collect and handle this data from multiple sources. See the [Appendix](https://digital-land.github.io/blog-post/swarming-around-local-plan-data/#appendix) for more details.

The team gathered data from [311 LPA websites](https://www.gov.uk/find-local-council) in England and collected thousands of PDFs and other documents relating to their local plan.

To help with this time-consuming task we created a [Local Plans Explorer prototype](https://local-plans-explorer.digital-land.info/), a tool which can quickly and carefully review documents to make sure they are valid and relevant \- for example checking the documents contain a date, a local plan description, a local plan boundary etc to decide if the document contains the right data to put on the planning data platform. This was validated by members of the team who have previously been planners and colleagues from the Local Plans policy team at MHCLG. They swarmed together to help to check that the information ‘scraped’ from the websites was accurate, relevant and useful.

## Rapid progress
In just one afternoon, with the help of the prototype, the team processed, ready for export to the platform:

* Processed [120 local plans](https://www.planning.data.gov.uk/entity/?dataset=local-plan)   
* Validated [308 local plan documents](https://www.planning.data.gov.uk/entity/?dataset=local-plan-document)   
* Checked [47 local plan boundaries](https://www.planning.data.gov.uk/map/?dataset=local-plan-boundary) 

We found over the course of an afternoon that a planner can validate and publish around 10 local plans, demonstrating the dramatic efficiency savings digital tools can provide, to a traditionally time-consuming task.  

However we found that local plan timetable data requires additional standardisation before it can be uploaded to the platform because of inconsistent date formats and the information being presented differently by different LPAs. 

## Next steps
We’re continuing to enhance the planning data platform and are therefore planning our second ‘swarm’ with even more planners to accelerate the process of getting more local plan data uploaded.  This will help to ensure the country’s local plans can all be viewed easily and are accessible in one place.

## Guidance for LPAs to get their local plan published on the platform

We have developed guidance to assist LPAs to present and publish their local plan data effectively. [Local plan data guidance](https://www.planning.data.gov.uk/guidance/specifications/local-plan)

### Appendix
**A local plan specification** The local plan specification ensures consistent streamlined access to key planning data from multiple sources in four datasets \- [https://digital-land.github.io/specification/specification/local-plan/](https://digital-land.github.io/specification/specification/local-plan/):

**local-plan dataset ([https://www.planning.data.gov.uk/dataset/local-plan](https://www.planning.data.gov.uk/dataset/local-plan)) \-** *one record per local plan*

**local-plan-document dataset ([https://www.planning.data.gov.uk/dataset/local-plan-document](https://www.planning.data.gov.uk/dataset/local-plan-document)) \-** *all the documents that form part of/or support the local plan*

**local-plan-boundary dataset ([https://www.planning.data.gov.uk/dataset/local-plan-boundary](https://www.planning.data.gov.uk/dataset/local-plan-boundary)) \-** *usually the same as the local authority district, but not always…*

**local-plan-timetable dataset ([https://www.planning.data.gov.uk/dataset/local-plan-timetable](https://www.planning.data.gov.uk/dataset/local-plan-timetable))** \- *details of when events/milestones will happen with the local plan*.

## Learn more
Find out more information about how we’re revolutionising access to planning data by visiting the [Digital Planning programme](https://www.localdigital.gov.uk/digital-planning).
