const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { parse } = require("node-html-parser");
const fs = require("fs");

module.exports = (function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // Watch styles folder for changes
  eleventyConfig.addWatchTarget("_styles");

  eleventyConfig.addPassthroughCopy("_styles");
  eleventyConfig.addPassthroughCopy('../_assets');
  eleventyConfig.addPassthroughCopy('node_modules/mermaid/');
  eleventyConfig.addPassthroughCopy('../cryptography/agility/');
  eleventyConfig.addPassthroughCopy('../feature-proposals/yjs/');
  eleventyConfig.addPassthroughCopy('**/*.pdf');

  eleventyConfig.addGlobalData("layout", "layouts/base");

  // XXX is this needed?
  // eleventyConfig.setServerOptions({
  //   watch: ["dist/app.js", "dist/app.*.css"],
  // });

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

  eleventyConfig.addGlobalData("site", {
    lang: "en",
    title: "CryptPad Blueprints",
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

  /* Generate the collection depending on the file location */
  try {
    const subfolderNames = fs
    .readdirSync("../document/user-stories/", { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);

    subfolderNames.forEach((subfolderName) => {
      eleventyConfig.addCollection(subfolderName, function(collectionApi) {
        return collectionApi
        .getAll()
        .filter((item) => item.inputPath.includes(`/${subfolderName}/`));
      });
    });
  } catch {
    console.error("Didn't manage to create collections");
  }

  /**
    * Add a shortcode to list user stories.
    * This is called with `{% listUserStories aCollection %}`.
    * cf. https://www.11ty.dev/docs/shortcodes/
    *
    * Possible improvements:
    * The order of the subelements is alphabetical. We can use some ordering
    * from eleventy's collections.
    *
    * So far it's using the file slug as there are no metadata in user stories,
    * but it can be improved using the title.
    */
  eleventyConfig.addShortcode("listUserStories", function(collection) {
    var storiesName = "";
    var subdirArray = collection.map(function (item) {
      if (!storiesName) {
        storiesName = item.data["stories name"];
      }
      return '<li><a href="' + item.url + '">' + item.fileSlug + '</a></li>';
    });

    if (!storiesName) {
      console.error("listUserStories: Collection not found");
      return "";
    } else {
      return "<ul><li>" + storiesName +"</li><ul>" + subdirArray.join("\n") + "</ul></ul>";
    }
  });


  return {
    dir: {
      input: "./../",
      output: "dist",
      data: ".app/_data",
      includes: ".app/_includes",
    },
  };
});
