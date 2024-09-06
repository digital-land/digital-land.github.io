---
title: "Open data and the planning data platform"
date: 2024-09-05
author: "Mike Rose and Kieran Wint"
status: beta
section: Data standards
summary: An explainer on what open data is, how it works, and why we need it for the platform.
---

## What is meant by ‘open data’?

“Open data is digital data that is made available with the technical and legal characteristics necessary for it to be freely used, reused, and redistributed by anyone, anytime, anywhere” - [Open Data Charter](https://opendatacharter.org/principles/).

The UK government [adopted](https://www.gov.uk/government/collections/open-government#open-data-and-the-open-government-license-) the principles of the Open Data Charter in 2015.

When we talk about open data, we are primarily talking about data that is shared under the ‘Open Government Licence’ as published by The [National Archives](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/open-government-licence/), often abbreviated to [OGLv3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

Under this licence, you are able to copy, publish, distribute, transmit and adapt the data you have accessed, as well as combine with other data to create new datasets. We need the data provided to the planning data platform to be shared with us under the OGLv3.0. This is so that we can legally share data under the OGLv3.0 with users of the platform. 

Within this, we acknowledge the original source of the data and link through to these sources, typically being local authority websites. This is where any data we are using needs to be clearly marked as being shared under the OGLv3.0. Here is an example of good practice in terms of labelling data as open data from [Barnet](https://open.barnet.gov.uk/dataset/20yo8/conservation-areas).

The OGLv3.0 is the optimal licence for local planning authorities to use as it was written with the UK public sector in mind, but there is an equivalent Creative Commons licence which could also be used, the [CC BY](https://creativecommons.org/share-your-work/cclicenses/). This is legally equivalent to the OGLv3.0. 

## Examples

To illustrate the importance of open data licensing, we have produced the following examples. You can see the impact that data licences make to services such as the planning data platform, and how licensing questions and confusion can spread.

### Success case

<img width="746" alt="A diagram demonstrating how if all data flowing into a system is published as open data, the resultant dataset can also be used and shared as open. 3 separate data entities flowing into a bigger data entity, all marked as open" src="https://github.com/user-attachments/assets/cbc0f128-6726-4840-b555-05a44ae0b419">

This first example demonstrates how open data works in a perfect world. All of the data flowing is clearly licensed as open data, and so the resulting data can also be shared and used as open data. 

### Issue case

<img width="773" alt="A diagram demonstrating how if one contributor of data provides data under a restrictive licence, this has a knock on impact. 3 separate data entities, 2 being open, 1 being restrictive, flowing into a bigger data entity which cannt be shared as open" src="https://github.com/user-attachments/assets/1efb5624-9d59-41b1-8f81-052d52a97350">

In this example the majority of data flowing into the resultant dataset is published as open data, but there is also some data being sought after which has a restrictive licence. This happens because the  data is shared under a licence which isn’t OGL compatible, so any resultant dataset **cannot** be published under the OGL.

This is a potential scenario that we have seen a couple of times with nationally available datasets, such as historic landfill. [For licensing geeks - [here](https://www.data.gov.uk/dataset/17edf94f-6de3-4034-b66b-004ebd0dd010/historic-landfill-sites) is the information on data.gov.uk relating the historic landfill dataset and if you view the licence information you can see the restriction]

### Issue case

<img width="509" alt="A diagram demonstrating how an unknown licence brings things to a stop. 3 separate data entities, 2 being open, 1 being with no licence, culminating in a dataset which is unclear on whether it can be used at all" src="https://github.com/user-attachments/assets/ded4bf0a-9bf0-4942-8264-4e08b6a2abe8">

This  is happening in some cases with data provided to the planning data platform. An example would be an LPA sharing data on their website in an endpoint format which we can use, without an explicit mention that the data is shared under the OGLv3.0.

In this case, it is simply unclear whether we are able to use the data being provided. We may be able to assess this by looking at the content outlining copyright permissions for the website, or by asking the local authority directly, but there is a time cost in doing this when the data can simply be labelled as being open data.

### Combined example

<img width="420" alt="A larger example, showing 9 datasets being shared as open, but with one entity being shared with a restrictive licence and one entity being shared with no licence through different phases resulting in unclear permissions" src="https://github.com/user-attachments/assets/1da9b02c-cf02-4ac1-bac0-4aafd0774cd0">

This example takes all of the previous scenarios and puts it into practice. You can see that despite the vast majority of inputs to the final dataset being shared as ‘open data’, there is a restrictive licence in the first phase which has a knock-on effect to the second phase, and an absence of licence entirely later on means that it is altogether unclear whether the resultant dataset can be shared at all, with the risk being that it breaches copyright, database rights or unknown licence requirements.

## How the Data Design team are helping

If data is being produced for the purposes of the planning data platform, but requires the use of further third party data to create it, this needs to be assessed by data providers to make sure that their resultant dataset will be shareable as open. 

In the Data Design team, when we are developing data specifications where we suspect that data, for example Ordnance Survey base mapping, will need to be used to create the dataset, we are seeking to clarify and document that the data we are asking for can be shared under an open licence. [Note - you can see under the planning section on this [Ordnance Survey](https://www.ordnancesurvey.co.uk/customers/public-sector/public-sector-licensing/publish-derived-data) webpage where we have got clarification so far.]

## How can you make sure you are clear?

To ensure that the planning data platform can collect data efficiently and  share data openly, data providers need to state on the webpage where the data is being shared that it is ‘licensed under the terms of the OGLv3.0.’ 

Fundamentally, for data to be open you have to actively say it’s open with an appropriate licence! 

Credit: Gwen Henderson (Content lead) 
