---
title: "Local plan and local area requirement analysis"
date: 2024-07-30
author: "Kieran Wint and Claire Miller"
status: beta
section: Data standards
summary: An update on some of the work we've been doing to see which planning considerations might be of most value to users in the future.
---

## Extensive backlog!

We have an extensive [backlog](https://design.planning.data.gov.uk/planning-consideration/) of 264 planning considerations (as of writing). Not having any priorities on which considerations to cover and research in more detail feels like it comes with a large risk of wasting time and money as we're not looking at the most beneficial datasets for the platform. So, we were keen to identify the considerations with the most value to users, so that we can prioritise what to add to the platform and minimise that risk of waste. We’re also interested in understanding how the planning considerations on the backlog support plan-making and planning decisions.

To support this, over the last couple of months we have been spending some time looking at: 

- Local area requirements - requirements (sometimes known as validation checklists) that set out supporting information which applicants need to include with a planning application
- Local plans - the development plan and supporting evidence-based documents which guide decisions on future development proposals, growth and opportunities for the area

Looking at a sample of different local area requirements and local plans, we did some analysis to identify the most common considerations and [triggers](https://digital-land.github.io/blog-post/digging-into-local-area-requirements/).

Here’s how we did it, and what we found out.

## Local area requirements

There are many types of application for consent, such as householder applications, change of use applications and advertisement consent. Each of these (and more) have different ‘requirements’ to validate an application, which often differ between local planning authorities.

Where a ‘trigger’ for a requirement was explicit, we captured this. For example, a ‘trigger’ for the requirement of a heritage statement is a listed building. Once we had reviewed all of the local area requirements for a sample of local authorities, we totalled the instances of ‘trigger’ considerations, with conservation areas appearing 6 times, listed buildings 5 times, locally listed buildings 4 times, and a further 6 considerations all appearing 3 times.

## Local plans

After a data scraping exercise which standardised the typical chapter headings of a local plan, we analysed a sample of local plans from a range of local authorities. The results were:

- Number of consideration appearances per chapter heading (for example, where a local plan had a chapter titled “Environment and resources”, this loosely matched with the standardised heading “Environmental assessment and sustainability considerations”, and so the considerations mentioned in this chapter were captured, and cross-referenced with other local plans which also had matches with this standardised chapter heading)
- Number of consideration appearances combined (across all chapters)
- Prioritisation based on number of appearances

The considerations which made the most appearances within this exercise were:

- sites of special scientific interest and conservation areas - 10 appearances
- local wildlife sites, heritage assets (designated AND non-designated) - 9 appearances
- ancient woodlands, playing pitches and brownfield land - 7 appearances
- local nature reserves, open space, flood risk, tree preservation orders - 6 appearances
- biodiversity net gain, contaminated land, hedgerows, agricultural land, public rights of way - 5 appearances

## Combined output?

In bringing together the results from both exercises, the planning expert within our team assisted in  weighting the results, ensuring a proportionate and more standardised approach was taken in providing one final output. 

There were also some limitations to the research, such as:

- Sample size - analysing local area requirements and local plans is an extensive task, requiring significant resource, and therefore, we had a small sample size of local plans.
- Variety in local authorities - in the local plan analysis, there were no densely populated areas taken into account, which might have led to a lack of representation of planning considerations relevant to such areas.
- Considerations can be called slightly different things across local authorities, making standardisation of terms, and the recognition of this, difficult.
- There are further documents that can contribute towards development plans, such as evidence base documents, supplementary planning documents, area action plans etc, but these were largely not taken into account and the local plan document was used.
- Local area requirements can vary heavily between local authorities as they tend to be driven by locally specific factors, and local plans.
- The weighting used lacked a robust statistical method, so although the results give us a basis for prioritisation on where value might be, we cannot say this with absolute certainty.

With this in mind, the list of aggregated output is as follows:


| Planning consideration                         | Score awarded |
| :--------------------------------------------- | :-----------: |
| Conservation areas                             | 10            |
| Listed buildings                               | 10            |
| Local nature reserves                          | 10            |
| Sites of special scientific interest           | 10            |
| Flood risk zone 1                              | 8             |
| Flood risk zones                               | 8             |
| Flood risk zone 3b                             | 8             |
| Hedgerows                                      | 8             |
| Playing fields                                 | 8             |
| Agriculturual land classification              | 8             |
| Air quality management areas                   | 8             |
| Ancient woodlands                              | 8             |
| Best and most versatile agricultural land      | 8             |
| Coastal storm surge flood risk areas           | 8             |
| Contaminated land                              | 8             |
| Green corridors                                | 8             |
| Mineral safeguarding zones                     | 8             |
| Non-designated heritage asset                  | 8             |
| Sites of importance for nature conservation    | 8             |
| Tree preservation orders                       | 8             |
| Scheduled monuments                            | 7             |
| Allotments                                     | 7             |
| Archaeological remains                         | 7             |
| Greater London archaeological priority areas   | 7             |
| Historic landfill                              | 7             |
| Waste and recycling facilities                 | 7             |
| Special areas of conservation                  | 6             |
| Ancient and veteran trees                      | 6             |
| Biodiversity net gain                          | 6             |
| Biodiversity net gain assessments              | 6             |
| BLDGS (Buildings)                              | 6             |
| Brownfield land                                | 6             |
| Gypsy, Roma and traveller sites                | 6             |
| Indoor sports and leisure facilities           | 6             |
| Locally listed buildings                       | 6             |
| Public rights of way (PRoW)                    | 6             |
| Religious buildings                            | 6             |


So in answer to the questions at the beginning of this post:

- Have we identified those considerations of most value to users to add to the platform next?
  * Yes. We now have a clearer understanding of the planning considerations which will be of most value to users, and should be prioritised.
- Does this data support plan-making and planning decisions?
  * Yes, we are confident that by making the prioritised datasets available to users, this will support both plan-making, and planning decisions.
 
As a final note it is encouraging that even with the previously mentioned limitations of the research, a number of considerations that appear most predominantly in the results (such as conservation areas, listed buildings, sites of special scientific interest, and ancient woodlands) have been or are currently the subject of our focus. We have already supported and designed specifications for these with many more in progress.


Credits: Claire Miller (Planning Subject Matter Expert), Gwen Henderson (Content lead).
