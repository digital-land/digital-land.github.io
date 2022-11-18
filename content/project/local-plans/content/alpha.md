---
name: Alpha
key-stats:
    outputs:
        prototypes: 3
        data-standard: 1
        guidance: 1
    user-testing:
        local-planning-authorities: 8
        planning-inspectorate-officiers: 3
        MHCLG-policy-makers: 3
displayContents: True
---
## Introduction

In March 2020, we opened a [supplier opportunity](https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/11591) on Digital Marketplace to work on the local plans [alpha phase](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works). It was awarded to [dxw](https://www.dxw.com/).

The project tested ideas for the better use of data held within and about local plans. Data _within_ local plans is information contained in a plan, such as the number of houses a local authority plans to build. An example of data _about_ local plans might be an overview of when each local planning authority last published theirs.

## User needs

During the alpha project, the team identified these additional user needs:

#### As a Planning Inspectorate (PINS) officer, I need...
- to be made aware of changes or revisions to a local authority's local development scheme ⇒ so that I am able to better resource and plan examinations
- to be able to easily query the data contained in a local development scheme ⇒ so that I know it's accurate

#### As a local planning authority officer, I need...
- to be able to see the vision / priorities / policies for neighbouring authorities ⇒ so that I can collaborate across authorities and comply with the duty to co-operate effectively
- to benchmark against policies in neighbouring areas ⇒ so that I can determine what best practice looks like
- to see which policies apply to particular sites ⇒ so I can make decisions on planning applications
- consistent and easily accessible information on plan-making activities of other local authorities ⇒ so I can have the above results

#### As a policymaker, I need...
- to know the history of a local development scheme ⇒ so I can contextualise the changes to dates made at each stage
- to know which authorities have emerging policies on certain matters ⇒ so that I understand the impact of a national policy change

<div class="highlight-box--cta">
  <a href="https://digital-land.github.io/project/local-plans/#user-needs">Read the full list of user needs</a>.
</div>

## Outputs

dxw proposed a data standard for local plans, as well as guidance on how to publish the data. They also designed and tested 3 prototypes to visualise data about and within local plans.

### [Data standard](https://docs.google.com/spreadsheets/d/13mqs6lZy6SyO0xCKcIXtL71SnqnDAZ2hBj3RBpWP_DM/edit?usp=sharing)

The data standard improves the quality, consistency and usefulness of data published about local plans. It looks at how we can standardise information on:

* which area the plan cover 
* the status of the local plan
* when it was adopted 
* what policies it contains 
* other high-level information

This data standard is based on the learnings from the brownfield land and developer contributions data standards, previously developed by the Digital Land team.

### [Guidance for publishing local plans data](https://docs.google.com/document/d/1Egi-EwFLFVWDi-QFNH5jiOwgcgDK9W6xnCFNGJSzxE8/edit?usp=sharing)

Clear, accessible guidance is important to help local planning authorities publish their data in accordance with the standard. This guidance builds on the Digital Land team’s existing guidance on publishing [brownfield land data](https://www.gov.uk/government/publications/brownfield-land-registers-data-standard/publish-your-brownfield-land-data), and [developer contributions data](https://www.gov.uk/guidance/publish-your-developer-contributions-data).

### [Prototype 1: a local authority’s local plan page](https://local-plan.herokuapp.com/v1)

This design was an example of a local plan page for local authorities, and included a table of policy data.

It was tested with 3 local planning authorities, and has helped our understanding of where there is common language. 

It has also helped show some of the constraints around standardisation. Since local plans respond to local needs, the flexibility in their production is a strength of the system. However, this flexibility makes standardisation challenging.

Watch [dxw’s first show and tell](https://drive.google.com/file/d/1BPeaV5t7rQQkbWN36k25V2sB5uDu1wPQ/view?usp=sharing) for further details on this prototype and learnings from the user testing.

### [Prototype 2: a national picture of local plans](https://local-plan.herokuapp.com/v2)

Prototype 2 showed plan data (including plan timetables) at both the national level and for individual planning authorities.

It was tested with 5 participants from the Planning Inspectorate (PINS) and the Ministry of Housing, Communities and Local Government (MHCLG). This helped to explore how a national picture of plan-making could be presented on the web, for example by a particular geography (not necessarily a local authority boundary).

### [Prototype 3: helping authorities use and submit local plan data](https://local-plan.herokuapp.com/v3)

Prototype 3 pulls together several of the alpha outputs, including the:

* national dataset of plans and policies (the “View plan data” web page)
* timetable overview for all current and emerging local plans
* downloadable development plan document data, and policy data
* web page with details for each local planning authority’s local plan data
* guidance for local planning authorities on how to publish their local plan data

It was tested with 5 local planning authorities.

Watch [dxw’s third show and tell](https://drive.google.com/file/d/1BPeaV5t7rQQkbWN36k25V2sB5uDu1wPQ/view?usp=sharing) for further details about this prototype and learnings from the user testing.

## Learnings

#### Importance of the data
Local plan and policy data is a vital and fundamental part of the emerging national data infrastructure for planning.

#### Data standard
A data standard for local plan timetables and policies improves how information about local plans can be communicated.

#### Common language
Whilst a data standard for plan timetables and policy categories is useful, the greatest value is creating a common language for describing policies.

Many terms have very specific meanings, but those meanings can change in different contexts. Examples of words that have caused confusion in user research are ‘area’, ‘strategic’, ‘supplementary’, ‘policy’, ‘evidence’, ‘status’ and ‘commitment’. It is important to use language that makes sense to all users of the data.

#### Presenting the data
Presenting local plans data in a variety of clear, accessible formats, will help policymakers, planning inspectors, and local planning authorities recognise the value of the data. This will also help them to use the data more easily, and with greater confidence.

## Opportunities

A data standard for local plans and an accessible way to access the data can open up important opportunities, including:

* a national picture of plan making
* an understanding  of where an individual plan is in its development
* better collaboration (formal and informal) between neighbouring local planning authorities
* more options to communicate content within local plans
* intelligent mapping of planning decisions to policies
* open data on development policies for others to build services on (such as [PropTech companies](https://digital-land.github.io/users/proptech/))

## Recommendations

The team recommends a [private beta](https://www.gov.uk/service-manual/agile-delivery/how-the-beta-phase-works) to test parts of the project that are critical to the success of a national local plan dataset, and to test a real version of the service with users. The project will only work if local planning authorities see the value, which the beta must focus on. The beta should also:

* test with users across a range of geographies, with groups of local planning authorities with shared objectives but different plans, policies, skills, resources and digital capacity
* answer important questions about policy categories, resources, managing GIS data, and the amount of time the solution might require from local planning authorities
* involve a wider group of users including infrastructure providers, PropTech companies and councillors
* create answers to the question “what’s in it for me?” asked by local planning authorities

<div class="highlight-box--cta">
Read the <a href="https://docs.google.com/presentation/d/e/2PACX-1vRQAXERMxFtnHperwzobOKVbOofG5SXwurb31AJZzOx5c7k1ObsBinNBuZ9uc1Ifw/pub?start=false&loop=false&delayms=3000">end of project alpha report</a>.
</div>

## Weeknotes

- [10th April 2020](/weeknote/2020-04-10/)
- [17th April 2020](/weeknote/2020-04-17/)
- [24th April 2020](/weeknote/2020-04-24/)
- [1st May 2020](/weeknote/2020-05-01/)
- [7th May 2020](/weeknote/2020-05-07/)

## Show and Tells

### Sprint 1
* [Recording of show and tell 1](https://drive.google.com/file/d/1BPeaV5t7rQQkbWN36k25V2sB5uDu1wPQ/view?usp=sharing)
* [Slides for show and tell 1](https://docs.google.com/presentation/d/e/2PACX-1vTuDaPchTKcTdaflZGOOR2rJZkPqoZQ6kKnL3B99hgpvIiLvpQdSwdo6i90xR_tlIVIzOyNHRsgHOzY/pub?start=false&loop=false&delayms=3000&slide=id.g6e7e08d689_0_0)

### Sprint 2
* [Slides for show and tell 2](https://docs.google.com/presentation/d/e/2PACX-1vRdSaZRUfosBbsnxDEhL4m6RvhmOnRXMGftJosvq9C2QdBOCwiVtzRsOiYVQ2mxVCdIwH-x7iAiMH8B/pub?start=false&loop=false&delayms=3000&slide=id.g6e7e08d689_0_0)

### Sprint 3
* [Recording of show and tell 3](https://drive.google.com/file/d/1BPeaV5t7rQQkbWN36k25V2sB5uDu1wPQ/view?usp=sharing)
* [Slides for show and tell 3](https://docs.google.com/presentation/d/e/2PACX-1vT2t1lR3-nPKvqJO8a950ijU6Z8BhbWjkdvtmakLsfYaSOYA0wUmNwRViNxX6N-cQ/pub?start=false&loop=false&delayms=3000)
