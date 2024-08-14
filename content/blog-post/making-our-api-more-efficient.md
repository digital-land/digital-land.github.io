---
title: "Making our API more efficient for data consumers"
date: 2024-08-13
author: "Ben Hodgkiss"
status: beta
section: Planning data
summary: Working with PlanX, the Planning Data team have been able to streamline our API to boost efficiency and reduce energy.
---

The amount of electricity used by data centres is increasing rapidly. Recent research in the Republic of Ireland shows a [400% increase](https://datacentremagazine.com/critical-environments/power-hungry-data-centres-put-pressure-on-irelands-grid) from 2015 to 2024. As AI and digital services grow, it’s important that we aim to minimise the pressure on data centres by providing lean code with the minimal outputs that use the least electricity.


## The challenge of data bloat

However, it can be really hard to think about how to do that when you’re in the middle of a large project like [Planning Data](https://www.planning.data.gov.uk/about/). This service collects planning and housing data from a wide variety of sources and transforms it into a consistent state available to all. 

The platform reduces the work which every planning service needs to undertake to find and make planning data usable, and creates opportunities to learn from users on ways we can further reduce this duplicated effort.

[PlanX](https://www.planx.uk/) are one of the services built using data from the Planning Data platform. Their product uses [our API](https://www.planning.data.gov.uk/docs) to check if a property is within an area of conservation, affected by an Article 4 direction, or has a high flood risk along with a number of other considerations offered by the API.

This could result in a rather large response (as in this example for a [commercial premises in Lambeth](https://www.planning.data.gov.uk/entity.json?entries=current&geometry=MULTIPOLYGON+%28%28%28-0.12093+51.492328%2C+-0.120915+51.492299%2C+-0.11981+51.492079%2C+-0.119785+51.49208%2C+-0.119585+51.492034%2C+-0.119537+51.492132%2C+-0.119409+51.492204%2C+-0.12047+51.492409%2C+-0.120465+51.49242%2C+-0.120554+51.492439%2C+-0.120762+51.492512%2C+-0.12093+51.492328%29%29%29&geometry_relation=intersects&limit=100&dataset=article-4-direction-area&dataset=central-activities-zone&dataset=brownfield-land&dataset=brownfield-site&dataset=area-of-outstanding-natural-beauty&dataset=conservation-area&dataset=green-belt&dataset=national-park&dataset=world-heritage-site&dataset=world-heritage-site-buffer-zone&dataset=flood-risk-zone&dataset=listed-building&dataset=listed-building-outline&dataset=scheduled-monument&dataset=ancient-woodland&dataset=ramsar&dataset=special-area-of-conservation&dataset=special-protection-area&dataset=site-of-special-scientific-interest&dataset=park-and-garden&dataset=tree&dataset=tree-preservation-order&dataset=tree-preservation-zone)) because the API would bring back all the data for that record including the boundary data. The example query above returns a rather large 3.7 Mb. This means long loading times for users, especially when a query is being run on a regular basis. PlanX got in touch to ask if we could remove the geometry results from the API. Geometry details are by far the largest amount of data returned. Some datasets (like flood risk zones) are really detailed in their geometries. However, PlanX didn’t need them. They only care whether the property sits within a conservation area, not the exact details of where the conservation area starts and ends!


## A Targeted Solution: The Exclude-Field Parameter

When we heard this from PlanX, we quickly workshopped a few ideas and decided on introducing an `exclude-field` parameter to the API. This would allow users to do exactly what they wanted - bring back everything except those large geometry files.

Within 3 weeks, we released this back to users. Within 24 hours, PlanX had implemented the parameter across their queries.


## Efficiency & Environmental Benefits

For that commercial Lambeth property query above, it’s clear how much shorter the [revised query return](https://www.planning.data.gov.uk/entity.json?entries=current&geometry=MULTIPOLYGON+%28%28%28-0.12093+51.492328%2C+-0.120915+51.492299%2C+-0.11981+51.492079%2C+-0.119785+51.49208%2C+-0.119585+51.492034%2C+-0.119537+51.492132%2C+-0.119409+51.492204%2C+-0.12047+51.492409%2C+-0.120465+51.49242%2C+-0.120554+51.492439%2C+-0.120762+51.492512%2C+-0.12093+51.492328%29%29%29&geometry_relation=intersects&limit=100&dataset=article-4-direction-area&dataset=central-activities-zone&dataset=brownfield-land&dataset=brownfield-site&dataset=area-of-outstanding-natural-beauty&dataset=conservation-area&dataset=green-belt&dataset=national-park&dataset=world-heritage-site&dataset=world-heritage-site-buffer-zone&dataset=flood-risk-zone&dataset=listed-building&dataset=listed-building-outline&dataset=scheduled-monument&dataset=ancient-woodland&dataset=ramsar&dataset=special-area-of-conservation&dataset=special-protection-area&dataset=site-of-special-scientific-interest&dataset=park-and-garden&dataset=tree&dataset=tree-preservation-order&dataset=tree-preservation-zone&exclude_field=geometry,point) is. However, the scale of the decrease in response size did shock us, the new return is a mere 2.5 kB – a hefty 99.9% decrease!


## Lessons for Sustainable Software Development

Obviously, this level of decrease will change for each individual query, depending on which datasets are returned and the complexity. However, it is clear that by doing this, we have solved more than just our initial problem.

We’ve made life easier for our API users, like PlanX. Going forward, we will be making sure that we keep a close eye on how we can reduce data bloat from the outset with our code, not just for our users, but also to pass on this vast power saving to our data centres – and therefore minimise electricity and ultimately carbon output.

Credit: Feba Rajan (Developer) 
