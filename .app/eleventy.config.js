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

  /**
    * Add a shortcode to list user stories.
    * This is called with `{% listStories %}`.
    * cf. https://www.11ty.dev/docs/shortcodes/
    *
    * So far it reads the content directory structure, but it would be cleaner
    * to use eleventy structure for that:
    * https://stackoverflow.com/questions/55496831/how-can-an-eleventy-site-display-a-list-of-pages-in-a-directory
    *
    * Possible improvements:
    * The order of the subelements is alphabetical and the order of the stories
    * is defined by the order of the array storyType.
    *
    * We are also writting directly HTML, it would also be cleaner to use jsdom
    * for instance to write in the DOM directly.
    */
  eleventyConfig.addShortcode("listUserStories", function() {
    var associateStoryType = {
      "admin": "Admin stories",
      "business": "Business stories",
      "developer": "Developer stories",
      "evil": "Evil user stories",
      "honest": "Honest user stories",
      "shit": "Dishonest user stories"
    };
    var storyType = ["honest", "admin", "evil", "shit", "developer", "business"];

    var storiesPath = "../document/user-stories";

    var subdirArray = storyType.map(function (subdir) {
      var subdirStoriesDir = fs.readdirSync(storiesPath + '/' + subdir);
      var storyAnchors = subdirStoriesDir.map(function(url) {
        var storyName = url.replace(/.md$/, '');
        return '<li><a href="/' + storiesPath + '/' + subdir + '/' + storyName + '">' + storyName +'</a></li>';
      });
      return '<li>' + associateStoryType[subdir] +'</li>\n<ul>\n' + storyAnchors.join('\n') + '\n</ul>';
    });

    return "<ul>" + subdirArray.join("\n") + "</ul>";
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
