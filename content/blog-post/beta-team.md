---
title: "Planing Data Service"
date: 2023-06-14
author: "Paul Downey"
status: beta
---

A talk Paul Downey gave on meeing the new planning data service team.

Hello, I'm Paul and I'm your Service Owner for the new Planning Data service.
When I first met you last week I offered some ways I can help you deliver, and said I'd give you clear outcomes to work to.
Here they are.

## What is a Service Owner?
You might not be familiar with the [Service Owner](https://www.gov.uk/guidance/service-owner) role.
Here's what I think it is:

* I’m going to help us validate and communicate our vision.
One that excites our users, and gives us pride in our work.
* I’m going to clarify our priorities.
And work with you to ensure we’re measurably delivering value.
* I’m going to establish a healthy team culture.
* And then I’m going to create the space, time, and money for us to work sustainably.

AND THAT’S IT!

## Really, Paul?
I did have a concern before taking on this role. 
I’m fascinated by the details, a lot of the code is my fault, and I have some strong views on some quite detailed things.
I’ll always be interested in the detail. I love data modelling. I’ll always write code. It’s my happy-place.
And I'm always on hand if you want my view on detail.
But being in the detail is no longer my job, it’s my hobby.
And that’s something I want you to remind me about if you hear me nitpicking the detail.

I think we need to work out how we’re going to work together.
But I know it’s something we’ll work out together.

## The unit of delivery is the team
<a href="https://www.flickr.com/photos/psd/26868697057/in/photolist-GWi6xx-dSQB4h-2iJrZTp" title="The unit of delivery is the team"><img src="https://live.staticflickr.com/943/26868697057_c58b7e5fef_n.jpg" alt="The unit of delivery is the team"/></a>

Words are cheap, so I’m not going to say too much about culture today. 
Instead I’m going to try and establish a new culture through leading by example.
There is one thing for me to tell rather than show. 
Our results don’t come from how we perform individually. 
They come from how well we play as a team.

## Our vision
<a href="https://www.flickr.com/photos/psd/43579359315/in/photolist-29oXBf4" title="Information model"><img src="https://live.staticflickr.com/1862/43579359315_de55e2bbc6.jpg" alt="Information model"/></a>

I think we have a strong vision, one that's survived a lot of challenge and testing. And it’s this:

> There is no shortage of people willing and able to build services to inform decisions throughout the planning and housing systems.
> But the biggest barrier they face is finding the data they need.
> Data they can understand, use and trust enough to build into services to inform important decisions for their users.
> Decisions which will help more people know where to build and how to go about building.
> With the potential to diversify the housing marketplace, transform the relationship between communities and development,
> and meet more people’s need for housing,

That’s our vision. It’s the reason we’re here, and it’s how our success will be measured and evaluated. 

## We need to change how we work
<a href="https://www.flickr.com/photos/psd/41029633762/in/photolist-jyYHT4-oPKYJw-oPNTYc-puaxVG-puaBz5-pubaqD-pudh7o-pGfsn5-pJw4x1-pLnFia-pLnHV4-pLBsQk-pLFMBC-xQTbtg-F5Tufk-25vDAEE-7poCaB-7vC8aR-2nc2WAm-c49faQ-dku3xm-dLTVws-dZ3PLs-dZZHnt-f1t7Do-6T7BH-JdMT" title="Design phases"><img src="https://live.staticflickr.com/897/41029633762_95129fdd9b.jpg" alt="Design phases"/></a>

I’m going to say something which might be tough for you to hear, but I think is important for me to say.
We’re not a discovery, and we’re no long in alpha. We worked hard on many different alphas over three years before passing our [alpha assessment](https://www.gov.uk/service-standard-reports/digital-land-alpha-assessment-report).
We’re a beta service, and have been since we launched planning.data.gov.uk last year in September. 
That means we have real users doing real things with real data.
But I think we’re currently failing them.

## We need to focus on our flow
<a href="https://www.flickr.com/photos/psd/46214552701/in/photolist-2dpPEqM" title="Do less, flow more"><img src="https://live.staticflickr.com/4866/46214552701_af5cda2276.jpg" alt="Do less, flow more"/></a>

We are failing our users and not giving them the data they need because our production line is blocked.
Our standards take too long to make.
Local authorities are still uncertain about what we expect them to do, and we don’t yet show them enough value from their hard work.
We haven’t added many new data sources since the launch.
And we still don’t know anywhere near enough about the users of our data.
In particular we’re failing to respond to, and action their feedback.

## We need to be effective, not just productive
<a href="https://www.flickr.com/photos/psd/52970036297/in/photolist-2oGMhkT-c6cfGW" title="The bottleneck is usually at the top"><img src="https://live.staticflickr.com/65535/52970036297_209c7e6b75.jpg" alt="The bottleneck is usually at the top"/></a>

Let me be clear.
This is despite you all individually doing great work. I mean that.
I loved the last show and tell. There was a lot of great work in there, and it was presented consumately.
You should be proud of your work, and how you work.

We’re failing because despite being productive, we’re not being effective.
That’s because we’ve failed to prioritise the right things.
And if the team is working on the wrong things, that’s now my fault. And my problem to solve.

So I’m going to help us get started.
And I’ll do that introducing you to [lean](https://en.wikipedia.org/wiki/Lean_software_development).

## But, WILL IT MAKE DATA FASTER?
<a href="https://www.flickr.com/photos/psd/52973861060/in/dateposted/" title="Will it make data, faster?"><img src="https://live.staticflickr.com/65535/52973861060_ee507466f6.jpg" alt="Will it make data, faster?"/></a>

Last time we spoke I promised you some clarity on the outcomes and our priorities.
Well this is it, and it’s one thing, and one thing only.
We’re going to get the data our users need to them faster.
A big part of that is prioritising which users, what data they need, to what quality.
I’ve some ideas on which datasets, which users, and what needs, but actually that’s for you lot to work out.

## Slow down to flow fast 
<a href="https://www.flickr.com/photos/psd/3352803663/in/album-72157614876087588/" title="Tyranny of the Active"><img src="https://live.staticflickr.com/1311/3352803663_730eb9f5dd.jpg" alt="Tyranny of the Active"/></a>

The first thing we’re going to do is learn how to flow by first slowing down.
If you think that means we’re not going to deliver anything for a while, 
well we've not delivered anything in while because our flow is blocked.
And don’t worry about being less busy.
I really don’t want you to be busy. 
Being too busy to talk to each other, learn, experiment, think about the flow is a big red blinking light for me.
What I want you to care about is improving our flow because we need to make data, faster.

## We're making data, everything else is waste
<a href="https://www.flickr.com/photos/psd/52965054397/in/photolist-qKrqJU-2oGkKp4" title="Data matures like wine, software matures like fish"><img src="https://live.staticflickr.com/65535/52965054397_de3bc3f579.jpg" alt="Data matures like wine, software matures like fish"/></a>

I particularly don’t want you just to be productive and pointlessly make lots of stuff.
We’ll need a lot of software and a lot of content stuff.
Be it needs to be the right stuff.
Stuff we can afford to keep and maintain.
Stuff that helps us make data, faster.
Everything else is a drag or a waste.

## Getting started

By now I imagine by now you’re thinking what the heck are we’re going to do next sprint. 
It’s two things. 

## Make the work visible
<a href="https://www.flickr.com/photos/psd/52965740037/in/photolist-2krNDcd-2oGpgdr" title="Log all the things!"><img src="https://live.staticflickr.com/65535/52965740037_572111e2c8.jpg" alt="Log all the things!"/></a>

Firstly, we need to make all of the work visible.
We do this because you need to see a problem before you can solve it.
It’s also so we have fewer surprises.
So I want to see numbers and boxes that go red and green for all our processes.
We particularly  need to understand how long each thing takes us to do: discover a dataset, design a specification, co-design it with LPAs, and add it to the platform, and how long things wait between steps.
Maybe start low-tech, post-its, spreadsheets, slide-decks and mural boards, 
before making notebooks, creating dashboards, and adding automated measurements, monitoring and alerting. 
That’s totally up to you.

## Make the value chain stable
<a href="https://www.flickr.com/photos/psd/14272167660/in/photolist-nKbAdd-H1fvF" title="Start with a single steel thread"><img src="https://live.staticflickr.com/2898/14272167660_7d2623def5.jpg" alt="Start with a single steel thread"/></a>

Then, when you’ve done that, start working on making things connected and stable.
If a step in our process isn’t well connected, we won’t flow.
If each step takes a random amount of time, we won’t know when we’re making data faster.
So we need to reduce the variability in our work.
 
For tech, that means ensuring the site stays up, and the data pipeline doesn’t break.
And it’s other things you think are broken.
I trust you to work it out.

For design, it’s better understanding how users see and use our service.
And clarifying what needs to be done at each stage of our value stream.
After that I’m not sure, but I know you know how to work it out. 
I want our designers to be designers.
Just do what you do best and work in the right way.
Ask great questions, challenge ideas, test your assumptions, elevate what we’ve learnt, and tell us stuff we don’t already know.

And that’s it for now.

## Giving you drive
<a href="https://www.flickr.com/photos/psd/11134670423/in/photolist-hXW6Ag-2dyCRg5-KuvyB" title="Autonomy, Mastery, Purpose"><img src="https://live.staticflickr.com/7376/11134670423_658bdfeaaa.jpg" alt="Autonomy, Mastery, Purpose"/></a>

So I’ve think I’ve given you a clear purpose. 
You’re going to make data faster.
And I’m giving you the space to mess up.
But I know you’ll rock it.
But most of all I think it’s going to be fun.
So crack on!
