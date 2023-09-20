const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { parse } = require("node-html-parser");

module.exports = (function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // Watch styles folder for changes
  eleventyConfig.addWatchTarget("_styles");

  eleventyConfig.addPassthroughCopy("_styles");
  eleventyConfig.addPassthroughCopy('../_assets');
  eleventyConfig.addPassthroughCopy('node_modules/mermaid/');
  eleventyConfig.addPassthroughCopy('../cryptography/agility/');
  eleventyConfig.addPassthroughCopy('../roadmap/yjs/');

  eleventyConfig.addGlobalData("layout", "layouts/base");

  // XXX is this needed?
  // eleventyConfig.setServerOptions({
  //   watch: ["dist/app.js", "dist/app.*.css"],
  // });

  // Markdown
    let markdownIt = require("markdown-it");
    let markdownItFootnote = require("markdown-it-footnote");
    let mdfigcaption = require('markdown-it-image-figures');

    let options = {
      html: true, // Enable HTML tags in source
      breaks: false,  // Convert '\n' in paragraphs into <br>
      linkify: true // Autoconvert URL-like text to links
    };

    let figoptions = {
      figcaption: true
    };
    // configure the library with options
    let markdownLib =  markdownIt(options)
      .use(markdownItFootnote)
      .use(mdfigcaption, figoptions);
    // set the library to process markdown files
    eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addFilter('sortByOrder', function(values) {
    return values.sort((a, b) => Math.sign(a.data.order - b.data.order));
  })

  eleventyConfig.addGlobalData("site", {
    lang: "en",
    title: "CryptPad Blueprints",
  });

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
