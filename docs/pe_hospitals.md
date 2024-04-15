---
theme: [wide]
title: PE Hospitals
toc: true
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: left;
  font-family: var(--sans-serif);
  /* margin: 0; */
  text-wrap: balance;
  text-align: start;
}

.hero h1 {
  /* margin: 2rem 0; */
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 14px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.2;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 30px;
  }
}

</style>


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
    width: "100%",
  }
)
// Generate an input based on the pe_names_input configuration
const selected_pe_names = Generators.input(pe_names_input);
```

```js
const pe_hospitals_filtered = pe_hospitals.filter(d => [...selected_pe_names].includes(d['PE Firm']))
const pe_hospital_table = Inputs.table(
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
const pe_hospitals_selected = Generators.input(pe_hospital_table)
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
      .filter(d => d['PE Firm'] !== null && d['PE Firm'].trim() !== '' && [...selected_pe_names].includes(d['PE Firm']))
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


<div class="hero">
  <h1>Clinicians.fyi</h1>
  <h2>Equipping clinicians with awareness and knowledge</h2>
</div>

---

## Data Source

Data is from <a href="https://pestakeholder.org/private-equity-hospital-tracker/" target="_blank">PE Stakeholder Project<span style="display: inline-block; margin-left: 0.25rem;"></span></a>website, organization with the mission statement: "_To bring transparency and accountability to the private equity industry and empower impacted communities._"

---

## Private Equity / Hospital Ownership

<div class="grid grid-cols-1">
    <div class="grid-colspan-1">
        <h3 style="color: blue">${selected_pe_names.length > 1 ? "Multiple PEs" : selected_pe_names[0]}</h3>
    </div>
</div>
<div class="grid grid-cols-2" style="padding: 0px;">
    <div class="grid-colspan-1 grid-rowspan-3">
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
    <div class="grid-colspan-1 grid-rowspan-3">
        <div class="card">
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
            <span>${pe_hospital_table}</span>
        </div>
    </div>
</div>
