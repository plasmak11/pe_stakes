// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Clinicians.fyi",
  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Healthcare Fraud",
      open: true,
      pages: [
        {name: "Criminal Cases", path: "healthcare-fraud"},
        {name: "Startups/Health Tech", path: "healthcare-fraud-startups"},
        // {name: "Ongoing", path: "healthcare-fraud-ongoing"}
      ]
    },
    {
      name: "Hospital Ownership",
      open: false,
      pages: [
        {name: "PE Hospitals Tracker", path: "pe_hospitals"},
        // {name: " ➟ Tutorial", path: "pe_hospitals_tutorial"},
        // {name: "Step 2: Observable Inputs", path: "step2"},
        // {name: "Step 3: Layout", path: "step4"},
        // {name: "Step 4: Map", path: "step3"},
        // {name: "Step 5: Final", path: "step5"},
      ]
    },
    // {
    //   name: "🔍 Looking for data",
    //   pages: [
    // //     {name: " ➟ 340B (WIP)", path: "340b"},
    //     {name: " ➟ PBM (WIP)", path: "pbm"},
    //   ]
    // },
  ],

  // Some additional configuration options and their defaults:
  theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: "Built with Observable.", // what to show in the footer (HTML)
  toc: true, // whether to show the table of contents
  pager: true, // whether to show previous & next links in the footer
  root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  interpreters: {
    ".py": ["/Users/jung/Library/Caches/pypoetry/virtualenvs/hospital-map-_kHyWl-y-py3.11/bin/python3"],
  }
};


