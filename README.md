# Statical

## The Radical Static Site Generator

Simplicity rules. Statical is a static website generator that uses simple conventions to help you create and maintain a static website with minimal dependencies and little conceptual overhead. With a few basic node modules and a no-nonsense build script it's easy to create, extend and maintain an information rich static website.

## Install

    npm i -g @kvnlnt/statical

## Quickstart

cd to a folder where you'd like to create a new site and:

    statical create --site=mysite.com

A starter site has been generated into a folder called `mysite.com`. Cd into it and:

    statical compile

Open up the site's `index.html` file in a browser. You're on your way.

## How it Works

### TLDR;

1. Data in `./src/data/_global.json` as well as other data specified in a page's config file gets merged
2. Page layouts specifed in `config.pages.[page].layout` get's merged with it's partials, specified in `config.pages.[page].partials` as a string...
3. And it all get's compiled together with Handlebars

### Structure

The entire app is made up of the following:

- `/public` - the place where pages are auto generated to as well as the place to keep your static files
- `/src/statical.json` - global config and registry of pages
- `/src/pages/*.json` - page level configuration and data
- `/src/data/*.json` - a place to keep reusable data
- `/src/templates/layouts/*.html` - main layout templates
- `/src/templates/partials/*.html` - reusable html fragments

### Config

The config file is the heart of the app. The `config.pages` collection contains page the following configs:

- `config.file` - path and name of file to generate
- `config.layout` - layout file to use (loaded from the templates folder)
- `config.partials` - partials are injected into the template using css selectors. Example: a partial of `".layout-menu": "menu.html"` would get the contents of `/src/partials/menu.html` and inject it into the dom element `<div class="layout-menu"></div>` which is expected to be in the pages template.
- `config.params` - see [Data](#Data) below
- `config.data` - see [Data](#Data) below

### Data

Data is scoped like so: Global -> Page -> Data. Each time a page is compiled a data object is concatenated from the three scopes. The data is stored in three areas:

1. Globally available data is stored in the `./src/data/_global.json` file
2. Page Level data is stored in the `params` key of each page's config file (in `./src/pages/*`)
3. Reusable Fragments should be stored as json files in the `./src/data` folder. To include them, add the file name to a page config's `data` key.

### Templating

It uses [Handlebars](https://handlebarsjs.com/). All that data gets compiled against the fully concatenated template string (the template with it's partials) and compiled with Handlebars.
