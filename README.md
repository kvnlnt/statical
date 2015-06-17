![Alt text](build/images/statical.png)


Statical is a static website generator that uses a simple mnemonic to help you create and maintain a static website with minimal dependencies and little conceptual overhead.

## Setup
Clone this repo and:

	npm install & npm run dev

## How it works
Statical works by treating the content anatomy of a website like that of a russian doll. At the top you have a `Property` which contains a `Page` which contains a `Part` which contains a `Piece`. You decide how your content should be structured. Following a "code-behind" naming convention, each "entity" you create will optionally have a series of file types that support the element. For example a header `Part` would be comprised of a header.jst, header.yml, header.js and a header.css file.

The main concept however is that each content tier wraps the tier below it. This nested architecture allows you to compose reusable and configurable components in an intuitive and methodical way. This approach naturally facilitates a separation of concerns and avoids a number of other common pitfals (complex build scripts, unnecessary dependencies, high learning curve).

## Minimal knowledge required
Front end development is becoming ridiculous - simply too many tools, apis, build systems, plugins, etc. It's a mess. Statical is an attempt to find the balance between a back to basics approach coupled with the raw power of a number of node modules. To use *Statical* you need to understand the following: 

- How to use npm
- How [swig](http://paularmstrong.github.io/swig/) works (the templating engine)
- [yml](http://www.yaml.org/start.html) syntax

## Future-proofy
Statical's build script uses [PostCss](https://github.com/postcss/postcss) and [Babel](https://babeljs.io/) to transform CSS and Javascript. This means you can both use and learn future syntax today. Also, being "transpilers" means both tools greatly assist in writing less code that is cross browser compatible (there are exceptions) and cleaner. One small example of this is PostCss' "autoprefixer" plugin (we included it in Statical) which allows you to do away with vendor-prefixes all together. If you're not familiar with these tools - each provides plenty of docs. However, you don't even have to give a care, generic js and css work too.

## Structure
The folder structure looks like this:

- bin : _task scripts_
	- dev.js : _the main dev/build script_
- build : _the build folder!_
	- images : _all your images go here_
	- fonts : _fonts go here_
- src : _all source code_
	- patterns : _reusable code patterns, library code_
		- html : _html patterns_
		- scripts : _js patterns_
		- styles : _css patterns_
	- property : _core app styles and scripts_
	- pages : _all pages and their styles and scripts_
	- parts : _all parts with their styles and scripts_
	- pieces : _all pieces with their styles and scripts_
	- vendor : _all vendor styles and scripts_

## Compilation
The final ./build/script.js file is compiled synchronously. Reading from the package.json file the compilation goes like this:

1. patterns/scripts
1. pieces
1. parts
1. pages
1. property

This means all your library code (like jquery or custom libs) need to go into the patterns folder. And your main application code needs to go into the property folder, running last after all libs, components, etc have been defined. 

Compilation for css is similar but moves the property css up after patterns like so:

1. patterns/styles
1. property
1. pieces
1. parts
1. pages

This order allows for a clean cascading heirarchy. First all your library code (like bootstrap, etc) in patterns and all your styles in property are compiled to establish a foundation. Then pieces, parts and pages are styled. This provides a clean hierarchy of overwrites. A `Piece`, while inheriting whatever base styling is applied can further apply it's own styling with it's code behind file. However, when a piece is included into a `Part` or `Page`, those elements can overwrite the `Pieces` providing contextual styling.

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

This page has a code-behind data file (about-us.yml) with a *title* property. The title is not being output here - although it could be with a `{{@page title }}`. Instead the page is including a part called *header*. Let's take a look at what the *header* part's files look like:

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

- the *header* part *compiled* the `{{@part leadline}}` block with it's config file and left the `{{@page title }}` block alone.
- the compiled *header* part was then included into the *about-us* page.
- where the *about-us* page compiled the `{{@page title}}` blocks with it's config file.

## Make sense?
With this structure, it's easy to *compose* a website with parameterized elements. In the example above the header part could be included into any page, outputting whatever title, etc was specified in that page's relative .yml file.

## Thoughts?
This is an architecture I've been using for over 12 years. It has served me well. With the proliferation of static site generators such as Metalsmith and Jekyll I felt it was time to try my hand at it. If you have any ideas or improvements to Statical, I'd love to hear it. Feel free to make a PR, drop me a line, etc.
