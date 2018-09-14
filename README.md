# Statical
## The Radical Static Site Generator

Simplicity rules. Statical is a static website generator that uses simple conventions to help you create and maintain a static website with minimal dependencies and little conceptual overhead. With a few basic node modules and a no-nonsense build script it's easy to create, extend and maintain an information rich static website.

## Install

    npm i statical

## Quickstart
cd to a folder where you like to create a new site and:

    statical create --site=mysite.com

A starter site has been generated into a folder called `mysite.com`. Open up the site's `index.html` file in a browser. Now go ahead and edit the `/src/data/home.json` file and change the title attribute to something else. Now run:

    statical compile

Check out the `index.html` again. It's title should be updated. That's pretty much how this all works. 

## How it Works

### TLDR;
1. Data in the `/src/data` folder, specified in the `config.global.data` and `config.pages.[page].data` configs gets merged
2. Page templates specifed in `config.pages.[page].template` get's merged with it's partials, specified in `config.pages.[page].partials` as a string...
3. And it all get's compiled together with Handlebars

### Structure
The entire app is made up of the following:
* `/public` - the place where pages are auto generated to as well as the place to keep your static files
* `/src/config.json` - a registry of all pages and their configurations
* `/src/data` - all data to be compiled in pages
* `/src/partials` - reusable html fragments
* `/src/templates` - main layout templates

### Config
The config file is the heart of the app. The  `config.pages` collection contains page the following configs:
* `config.file` - path and name of file to generate
* `config.template` - template file to use (loaded from the templates folder)
* `config.partials` - partials are injected into the template using css selectors. Example: a partial of `".layout-menu": "menu.html"` would get the contents of `/src/partials/menu.html` and inject it into the dom element `<div class="layout-menu"></div>` which is expected to be in the pages template. 
* `config.data` - much like partials the files specified in the data list is loaded from the `/src/data` folder and compiled with Handlebars against the template (including all it's partials).

### Data
Data is stored in the `/src/data` directory as json files. There is a global scope and a page scope. Data files listed in the `config.global.data` scope are available to every page. Data files listed in the `config.pages.[page].data` scope are merged with the global data (fyi: Page scoped variables will overwrite globals). 

### Templating
It uses [Handlebars](https://handlebarsjs.com/). All that data gets compiled against the fully concatenated template string (the template with it's partials) and compiled with Handlebars. 