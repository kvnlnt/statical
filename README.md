![Alt text](build/images/statical.png)


Statical is a static website generator that uses simple concepts to provide powerful functionality without a myriad of hacks, dependencies and the usual nonsense.

## Setup
Clone this repo and:

	npm install
	npm run dev

## How it works
Statical works by treating the content anatomy of a website like that of a russian doll. At the top you have a <code>Property</code> which contains a <code>Page</code> which contains a <code>Part</code> which contains a <code>Piece</code>. You decide how your content should be structured. Each type of content is a series of files that mimic the code-behind architecture. For example a header part might have a header.jst, header.yml and a header.scss file. However, the main concept is that each content tier wraps the tier below it and can pass data to them. This nested architecture allows you to compose reusable and configurable components in an intuitive and methodical way. This approach naturally facilitates a separation of concerns and avoids a number of other common pitfals (complex build scripts, unnecessary dependencies, high learning curve).

## Minimal knowledge required
Front end development is becoming ridiculous - simply too many tools, apis, build systems, plugins, etc. It's a mess. Statical is an attempt to find the balance between a back to basics approach coupled with the raw power of a number of node modules. To use *Statical* you need to understand the following: 

- How to use npm
- How [swig](http://paularmstrong.github.io/swig/) works (the templating engine)
- [yml](http://www.yaml.org/start.html) syntax

## Structure
The folder structure looks like this:

- bin // task scripts
	- dev.js // the dev/build script
- build // build code
- src // source code
	- property // contains global styles and scripts
	- pages // contains all pages and their styles and scripts
	- parts // contains all parts with their styles and scripts
	- pieces // contains all pieces with their styles and scripts
	- vendor // contains all vendor styles and scripts

## Scopes
There are four scopes matching each element type. A custom swig "varControl" has been setup for each. Scopes are accessed inside .jst or .html files via {{@scopename somevariable }}. The four scopes are:

	{{@property ...[variable goes here]... }}
	{{@page ...[variable goes here]...}}
	{{@part ...[variable goes here]...}}
	{{@piece ...[variable goes here]... }}

## An Example
Clear as mud? Let's try an example. Let's say you have a page called about-us. It would have two files: a .yml file which will serve as it's configuration/data file and a .jst file which will serve as it's javascript template. They would look like this:

### ./src/pages/about-us.yml
	
	---
	title: About Us
	---

### ./src/pages/about-us.jst

	{% include "./src/parts/header.html" %}
	...A bunch of stuff about us...

This page has a code-behind data file (about-us.yml) with a *title* property. The title is not being output here - although it could be with a <code>{{@page title }}</code>. Instead the page is including a part called *header*. Let's take a look at what the *header* part's files look like:

### ./src/parts/header.yml

	---
	leadline: This page is called 
	---

### ./src/parts/header.jst

	{{@part leadline}} {{@page title }}

Notice the two different scopes? *@part* and *@page*? Upon compilation a header.html file would be produced that would look like this:

### ./src/parts/header.html:

	This page is called {{@page title}}

This *header.html* file would then included into *about-us.jst* which would be compiled to a *about-us.html* page who's content would end up looking like this:

### ./src/pages/about-us.html:

	This page is called About Us

See how that works?

### This is what happened:

- the *header* part *compiled* the <code>{{@part leadline}}</code> block with it's config file and left the <code>{{@page title }}</code> block alone.
- the compiled *header* part was then included into the *about-us* page.
- where the *about-us* page compiled the <code>{{@page title}}</code> blocks with it's config file.

## Make sense?
With this structure, it's easy to *compose* a website with parameterized elements. In the example above the header part could be included into any page, outputting whatever title, etc was specified in that page's relative .yml file.

## Thoughts?
This is an architecture I've been using for over 12 years. It has served me well. With the proliferation of static site generators such as Metalsmith and Jekyll I felt it was time to try my hand at it. If you have any ideas or improvements to Statical, I'd love to hear it. Feel free to make a PR, drop me a line, etc.
