const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { parse } = require("node-html-parser");
const fs = require("fs");
const { DateTime } = require("luxon");

module.exports = (function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // Watch styles folder for changes
  eleventyConfig.addWatchTarget("_styles");

  eleventyConfig.addPassthroughCopy("_styles");
  eleventyConfig.addPassthroughCopy('../_assets');
  eleventyConfig.addPassthroughCopy('node_modules/mermaid/');

  // TODO find a clearer way of assigning the base layout, this is hidden
  eleventyConfig.addGlobalData("layout", "layouts/base");

  // File Size
  eleventyConfig.addFilter("filesize", (path) => {
    let fd = fs.openSync('../' + path);
    let stats = fs.fstatSync(fd);
    return (Math.ceil(stats.size / 1000)).toString() + ' KB';
  });
  // Dates
  eleventyConfig.addFilter("dateformat", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('dd-MM-yyyy');
  });
  // Remove the first item of the array, used for breadcrumb navigation
  eleventyConfig.addFilter("popfirst", (array) => {
    return array.shift();
  });

  // Markdown
    let markdownIt = require("markdown-it");
    let markdownItFootnote = require("markdown-it-footnote");
    let mdfigcaption = require('markdown-it-image-figures');
    let markdownItAnchor = require("markdown-it-anchor");

    let options = {
      html: true, // Enable HTML tags in source
      breaks: false,  // Convert '\n' in paragraphs into <br>
      linkify: true // Autoconvert URL-like text to links
    };

    let figoptions = {
      figcaption: true
    };

    let anchoroptions = {
        level: 1,  // Minimum level to apply anchors, or array of selected levels.
    };
    // configure the library with options
    let markdownLib =  markdownIt(options)
      .use(markdownItFootnote)
      .use(mdfigcaption, figoptions)
      .use(markdownItAnchor, anchoroptions);
    // set the library to process markdown files
    eleventyConfig.setLibrary("md", markdownLib);

    // compile markdown attributes
    eleventyConfig.addFilter("markdown", (content) => {
      return markdownLib.render(content);
      });

  eleventyConfig.addGlobalData("eleventyComputed", {
    eleventyNavigation: {
      key: (data) => {
        const url = data.page.url;

        if (url === "/") {
          return "/";
        }

        const strippedPath = url.endsWith("/") ? url.slice(0, -1) : url;
        return strippedPath;
      },
      parent: (data) => {
        const url = data.page.url;

        if (url === "/") {
          return undefined;
        }

        const strippedPath = url.endsWith("/") ? url.slice(0, -1) : url;
        const lastSlash = strippedPath.lastIndexOf("/");

        return lastSlash === 0 ? "/" : strippedPath.slice(0, lastSlash);
      },
      title: (data) => (data.eleventyNavigation.title || data.title),
    }
  });

  // Debug filter
  eleventyConfig.addFilter("log", (d) => {
    console.log(d);
  });

  eleventyConfig.addFilter("shuffle", (arr) => {
    arr.sort(() => {
      return 0.5 - Math.random();
    });
    return arr;
  });

  // Key / Value filter for user story extras
  eleventyConfig.addFilter("keyValue", (d) => {
    let key = Object.keys(d)[0];
    let value = Object.values(d)[0];
    return {"key": key, "value": value};
  });

  eleventyConfig.addFilter("mapToAttr", (elems, attr) => elems.map((e) => e[attr]));

  eleventyConfig.addFilter("toc", function (content) {
    // this filter is taken from the eleventy-notes project
    // https://github.com/rothsandro/eleventy-notes/blob/main/.app/lib/modules/toc/toc.filter.js

    const html = parse(content);
    const headings = html.querySelectorAll("h1, h2, h3, h4");
    const toc = headings.map((heading) => {
      heading.querySelectorAll("[aria-hidden=true]").forEach((el) => el.remove());

      const id = heading.attributes.id;
      const text = heading.innerText;
      const level = parseInt(heading.tagName.replace("H", ""), 10);

      return { id, text, level };
    });

    // The page title already uses an h1, so it's recommended
    // to start with h2 in the content. If the first heading
    // is an h2 or higher, we'll adjust the levels to start with level 1
    // to avoid unnecessary indentation in the TOC.
    const minLevel = Math.min(...toc.map((item) => item.level));
    if (minLevel > 1) toc.forEach((item) => (item.level -= minLevel - 1));

    return toc;
  })

  return {
    dir: {
      input: "./../",
      output: "dist",
      data: ".app/_data",
      includes: ".app/_includes",
    },
  };
});
