---
title: "Our approach to open space"
date: 2024-08-28
author: "Claire Miller"
status: beta
section: Data standards
summary: An overview of our proposed approach to capturing strategic and local open space on the platform.
---

The planning data team have an extensive [backlog](https://design.planning.data.gov.uk/planning-consideration/) of planning considerations, which we are progressing through. One of the topics we have been holding off on is the way we tackle open space on the platform.

## The problem

The reason why we have been holding off on this is because while there are several very distinct strategic green infrastructure designations which are widely used and understood, for the more local open space typologies, these are less distinct.

The [National Planning Policy Framework (NPPF)](https://assets.publishing.service.gov.uk/media/669a25e9a3c2a28abb50d2b4/NPPF_December_2023.pdf), and Planning Practice Guidance (PPG) on both [Natural Environment](https://www.gov.uk/guidance/natural-environment) and [Open space, sports and recreation facilities, public rights of way and local green space](https://www.gov.uk/guidance/open-space-sports-and-recreation-facilities-public-rights-of-way-and-local-green-space), include reference to many different forms of open space, such as:

- National Parks and the Broads
- Areas of Outstanding Natural Beauty (AONB)
- Sites of Special Scientific Importance (SSSI)
- Special Protection Areas
- Special Areas of Conservation
- Ramsar Sites
- Green Belt
- Local Wildlife Sites

These all have clear definitions, and criteria for meeting their designation. In many cases, a Local Planning Authority (LPA) would have to go through a formal process to designate additional land, or to change or remove boundaries of these planning considerations.

However, as well as these types of open space designations, LPAs will also designate more localised open spaces, e.g. through a Local Green Space designation, or other open space typologies. These will be captured on policies maps, to support Local Plan policies, while also being a consideration when planning for growth, to ensure that sufficient open space will be provided to meet local demand. Often LPAs will use provision and accessibility standards from either the Fields in Trust or Natural England, to ensure that they are planning to deliver sufficient open space.

These open space typologies are less prescriptive, and often have differing terminology between LPAs. There is a planning need to present this information on the platform (set out below), and therefore, we have been conducting some research into how we should best capture open space on the platform, using terminology which is clear, and best aligns with the way the majority of LPAs currently display this data, limiting any additional work necessary to get this data on the platform.

## The planning need

There are several identified planning needs for publishing open space data on the platform. When plan-making, LPAs are required to demonstrate that they are planning for sufficient open space to meet local need. Therefore, they will generally identify the baseline provision of open space, and conduct an Open Space Strategy, or similar, to assess the quality of this existing provision. Open space is generally categorised into specific typologies, defined by how they are used, and often, each typology has different standards used by LPAs to assess amount of provision (generally through a hectare per 1,000 of the population standard) and accessibility (generally through time taken to walk to the open space in minutes). Then overall required additional provision is calculated, both in terms of any shortfalls in provision against existing population, and then against proposed Local Plan growth.

The Local Plan will often address this additional required provision within policies, detailing how and when new open space will be supported, and that existing open space will be protected. These policies will be used when determining planning applications. When considering open space when assessing planning applications, some LPAs set out the required type and quantity of open space and outdoor recreation space that is required to be provided, whereas other LPAs set out a minimum area of all new major developments which must be publicly accessible open space.

These constitute a clear need case for the publication of open space on the platform in relation to both plan-making and development management.

## The research and findings

The data design team have been undertaking a review of existing national, regional and local policies and best practice of capturing this information, including terminology used, definitions of these, and use cases for planning for open space. We have reviewed the adopted NPPF, PPGs on Natural Environment and Open space, sports and recreation facilities, public rights of way and local green space, the widely used Natural England and Fields in Trust open space standards, and several LPAs and joint-authority policy documents.

From this, we propose the following approach:

Separate standalone designations for more strategic open space typologies:

- Area of Outstanding Natural Beauty
- Conservation Areas
- Green Belt
- Green Corridors
- Local Green Space
- Local Nature Reserves
- Metropolitan Open Land
- National Nature Reserves
- National Parks and the Broads
- Ramsar
- Regionally Important Geological Site
- Sites of importance for Nature Conservation
- Sites of Special Scientific Interest
- Special Areas of Conservation
- Special Protection Areas
- Suitable Alternative Natural Greenspace

For more local open space typologies, we propose asking for LPAs to provide their data using the following open space typologies:

- Amenity Greenspace - Informal recreation spaces, communal green spaces in and around housing, village greens, urban commons, and civic spaces
- Public Parks and Gardens - Accessible, high quality opportunities for informal recreation and community events, including urban parks, country parks, regional parks, forest parks, and formal gardens
- Natural and Semi-Natural Greenspace - Informal and natural green space providing the opportunity to promote meaningful and safe recreation, including woodland and scrub, grassland, heath or moor, wetlands, open and running water, and wastelands
- Children’s play space - Designated areas for children and young people containing a range of facilities and an environment that has been designed to provide focused opportunities for outdoor play, including Local Areas for Play (LAPs), Local Equipped Area for Play (LEAPs), -Neighbourhood Equipped Area for Play (NEAPs) and Multi-use Games Area (MUGAs)
- Allotments - Allotments, community gardens and community farms
- Cemeteries - Includes churchyards and other burial grounds. Areas for quiet contemplation and burial of the dead, but also often with high biodiversity value
- Playing pitches - Pitch sports including football, rugby union, rugby league, hockey, lacrosse, cricket, American football etc
- Other outdoor sports - Courts and greens comprising natural or artificial surfaces, including tennis courts, bowling greens, athletics tracks and other outdoor sports areas

We would be really keen to hear from anyone who has any thoughts on this proposed approach, and whether providing data in this format would work for you. We have an open github discussion page on ['Green space'](https://github.com/digital-land/data-standards-backlog/discussions/64) and would welcome your input.
