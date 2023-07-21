

module.exports = (function(eleventyConfig) {
  // Watch styles folder for changes
  eleventyConfig.addWatchTarget("_styles");

  // eleventyConfig.addPassthroughCopy('node_modules/mermaid/');

  // eleventyConfig.addFilter("mermaid", (data) => {
  //   let graphDef = 'graph LR\n';
  // });

  // eleventyConfig.addShortcode("roadmap", () => {
  //   mermaid.initialize({ startOnLoad: false });
  //   const drawDiagram = async function () {
  //     element = document.querySelector('#graphDiv');
  //     const graphDefinition = 'graph TB\na-->b';
  //     const { svg } = await mermaid.render('graphDiv', graphDefinition);
  //     element.innerHTML = svg;
  //   };
  //   drawDiagram();
  // });

});