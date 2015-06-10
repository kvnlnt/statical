![Alt text](statical.png)


Statical is a static website generator that uses a few simple concepts to provide powerful functionality without a myriad of hacks, dependencies and fyis.

## Setup
Clone this repo and:

	npm install
	npm run dev

## How it works
Statical works by treating the content anatomy of a website like that of a russian doll. At the top you have a <code>Property</code> which contains a <code>Page</code> which contains a <code>Part</code> which contains a <code>Piece</code>. Each element also has corresponding styles and scripts like that of the code-behind architecture of ASP.NET. This nested architecture allows you to compose all the elements in an intuitive and methodical way. It facilitates a natural separation of concerns which simplifies the build system while providing a powerful abstraction pattern that is technology agnostic.

## Structure
The folder structure looks like this:

- bin // scripts
	- dev.js // the dev/build script
- build // build code
- src // source code
	- property // contains global styles and scripts
	- pages // contains all pages and their styles and scripts
	- parts // contains all parts with their styles and scripts
	- pieces // contains all pieces with their styles and scripts
	- vendor // contains all vendor styles and scripts

## Scopes
There are four scopes matching each element type. Scopes are accessed inside .jst files via {{@scopename somevariable }}. The four scopes are:

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

Notice the two different scopes? *@part* and *@page*? This would lead to the generation of an *about-us.html* page who's content would look like this:

### ./src/pages/about-us.html:

	This page is called About Us

So what happened?

### This is what happened:

- the *header* part *compiled* the <code>{{@part leadline}}</code> block with it's config file and left the <code>{{@page title }}</code> block alone.
- the compiled *header* part was then included into the *about-us* page.
- where the *about-us* page compiled the <code>{{@page title}}</code> blocks with it's config file.

## Make sense?
With this structure, it's easy to *compose* as website with parameterized elements. In the example above the header part could be included into any page, outputting whatever title, etc was specified in the page's relative .yml file.

## Why it should make sense
- Dev site *is* production. Nobody likes surprises.
- Build tool agnostic. It neither uses nor precludes one.
- Minimal dependencies. Only a few dependable node modules using basic features.
- Minmal complexity. Just understand the hierarchy and you're good to go!
- Framework agnostic. That's your decision.
- UI and data are separated. Easily create a blog, dynamically generate a menu or add in I18n features.  
- UI components are reusuable
- Naturally extensible:
	- A pattern library or style guide could easily be created. Drop all your parts on a page.
	- git offers a natural versioning system
	- easily intergrate components created in other tools (Sketch for example)

## Thoughts?
This is an architecture I've been using for over 12 years. It has served me well. With the proliferation of static site generators such as Metalsmith and Jekyll I felt it was time to try my hand at it. If you have any ideas or improvements to Statical, I'd love to hear it. Feel free to make a PR, drop me a line, etc.
