---
theme: [wide]
title: PE Hospitals
toc: true
---

```js
const pe_hospitals = FileAttachment("dataloaders/pe-hospital-tracker.csv").csv({typed: true})
const cms_inpatient_hospitals = FileAttachment("dataloaders/cms_inpatient_hospitals.json").json()
const us = FileAttachment("dataloaders/counties-10m.json").json()
```

```js
const pe_names_input = Inputs.select(
  pe_hospitals.filter(d => d['PE Firm'] !== null && d['PE Firm'].trim() !== '').map((d) => d['PE Firm']),
  {
    label: "PE Firm",  // Set the label for the input field
    sort: true,  // Sort the options alphabetically
    value: ["formerly Leonard Green & Partners"],  // initial value
    multiple: 10,
    unique: true,
    // width: "",
  }
)
// Generate an input based on the pe_names_input configuration
const pe_names = Generators.input(pe_names_input);
```

```js
const pe_hospitals_filtered = pe_hospitals.filter(d => [...pe_names].includes(d['PE Firm']))
const pe_hospital_table_selection = Inputs.table(
    pe_hospitals_filtered,
    {
        rows: 15,
        sort: "Facility Name",
        value: pe_hospitals_filtered,
        width: {
            NAME: 250,
        },
        // format:{
        //     "Facility ID (CCN)": 
        // },
        layout: "auto",
        required: false,
    })
const pe_hospital_table = Generators.input(pe_hospital_table_selection)
```

```js
// Extract the nation feature from the TopoJSON data
// 'us' is assumed to be a TopoJSON data object
// 'us.objects.nation' specifies the path to the nation object within the 'us' data
const nation = topojson.feature(us, us.objects.nation);

// Generate a mesh representing the state boundaries
// 'us' is the same TopoJSON data object as above
// 'us.objects.states' specifies the path to the states object within the 'us' data
// The filter function `(a, b) => a !== b` includes boundaries between different states
const statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
```

```js
// pe_hospitals_filtered
const uniqueCompanies = [
  ...new Set(
    pe_hospitals
      .filter(d => d['PE Firm'] !== null && d['PE Firm'].trim() !== '' && [...pe_names].includes(d['PE Firm']))
      .map(d => d["Parent System/Company"])
  )
]
const unique_companies_label = uniqueCompanies.length > 0 ? uniqueCompanies : ["No Companies Found"]
```

```js
const selected_states_fips = pe_hospitals_filtered.map(item => String(item.fips).padStart(2, '0'))
const states = topojson.feature(us, us.objects.states).features
```

```js
// Count the occurrences of each FIPS code in selected_states_fips
const fipsCounts = selected_states_fips.reduce((counts, fips) => {
  counts[fips] = (counts[fips] || 0) + 1;
  return counts;
}, {});

// Join the count data with the state features based on the FIPS code
const stateDataMap = new Map(
  states.map(state => {
    const fips = String(state.id).padStart(2, '0');
    const count = fipsCounts[fips] || 0;
    return [fips, count];
  })
);
```

```js
const us_map = Plot.plot({
  marginLeft: 0,
  marginRight: 0,
  projection: "albers-usa",
  marks: [
    Plot.geo(statemesh, {strokeOpacity: 0.5}),
    Plot.geo(nation),
    Plot.geo(states,
    {
      fill: d => stateDataMap.get(d.id),
      opacity: 0.5
    }),
    Plot.text(states, Plot.centroid({text: (d) => d.properties.name, fill: "currentColor"}))
  ],
  color: {
    scheme: "reds",
    domain: [0, 1]
    // legend: true
  }
})

```

<div class="grid grid-cols-1">
    <div class="grid-colspan-1">
        <h3>${pe_names.length > 1 ? "Multiple PEs" : pe_names[0]}</h3>
    </div>
</div>

<div class="grid grid-cols-4">
    <div class="grid-colspan-1">
        <div class="card">${pe_names_input}</div>
        <div class="card">
            <h3>Hospitals</h3>
            <span class="big">${pe_hospitals_filtered.length.toLocaleString("en-US")}</span>
        </div>
        <div class="card">
            <h3>Companies</h3>
            <span>${html`${unique_companies_label.map(item => html`${item}<br>`)}`}</span>
        </div>
    </div>
    <div class="grid-colspan-2 grid-row-span-2 ">
        <div class="card grid-rowspan-1">
            <h4>U.S. Map</h4>
            <span>${us_map}</span>
        </div>
    </div>
</div>

<div>
    <div class="grid-row-span-2 grid-colspan-4">
        <!-- Hospitals card -->
        <div class="card grid-colspan-2">
            <h4>Hospitals</h4>
            <span>${pe_hospital_table_selection}</span>
        </div>
    </div>
</div>
