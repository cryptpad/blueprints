

module.exports = (function(eleventyConfig) {
  // Watch styles folder for changes
  eleventyConfig.addWatchTarget("_styles");

  eleventyConfig.addPassthroughCopy('node_modules/mermaid/');

  eleventyConfig.setServerOptions({
    watch: ["dist/app.js", "dist/app.*.css"],
  });

  eleventyConfig.addGlobalData("site", {
    lang: "en",
    title: "CryptPad Blueprints",
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