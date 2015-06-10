# Statical
Statical is a static website generator that uses a few simple concepts to provide powerful functionality. Functionality that is usually reserved for much more complex applications. 

## Setup
Clone this repo and:

	npm install
	npm run dev

## How it works
Statical works by treating the content anatomy of a website like that of a russian doll. At the top you have a <code>Property</code> which contains a <code>Page</code> which contains a <code>Part</code> which contains a <code>Piece</code>. Each element also has corresponding styles and scripts like that of the code-behind architecture of ASP.NET. This nested architecture allows you to compose all the elements in an intuitive and methodical way. It facilitates a natural separation of concerns which simplifies the build system while providing a powerful abstraction pattern that is technology agnostic.

## Structure
The folder structure looks like this:
	- property // contains global styles and scripts
	- pages // contains all pages and their styles and scripts
	- parts // contains all parts with their styles and scripts
	- pieces // contains all pieces with their styles and scripts
	- vendor // contains all vendor styles and scripts

## Scopes
There are four scopes matching each element type. Scopes are accessed inside .jst files via {{@scopename somevariable }}. As different elements include other elements (say a part includes a piece), the scopes are evaluated one at a time as they get "folded" up during compilation (like a russian doll). The four scopes are:

	{{@property ...[variable goes here]... }}
	{{@page ...[variable goes here]...}}
	{{@part ...[variable goes here]...}}
	{{@piece ...[variable goes here]... }}

### An Example
Clear as mud? Let's try an example. Let's say you have a page called about-us. It's files would look like this:

#### ./src/pages/about-us.yml
	
	---
	title: About Us
	---

#### ./src/pages/about-us.jst

	{% include "./src/parts/page-header.html" %}
	...A bunch of stuff about us...

This page has a code-behind data file (about-us.yml) with a *title* property. The title is not being output here - although it could be with a <code>{{@page title }}</code>. Instead the page is including a part called page header. Let's take a look at what the page-header part's files look like:

#### ./src/parts/page-header.yml

	---
	leadline: This page is called 
	---

#### ./src/parts/page-header.jst

	{{@part leadline}} {{@page title }}

#### Compilation then looks like this:

- the *page-header* part evaluated all <code>{{@part ...}}</code> blocks with it's data (coming from it's yml file).
- the *page-header* part is then included into the *about-us* page.
- the *about-us* page then evaluates all the <code>{{@page ...}}</code> blocks with it's data (coming from it's yml file).

#### Make Sense?
With each tier having contextual variable scope it's easy to compose all the elements within your site powerful ways. 
