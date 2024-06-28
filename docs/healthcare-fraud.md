---
theme: ["default"]
title: Healthcare Fraud
# toc: true
style: custom-style.css
---

<h1> Healthcare Fraud: Criminal Cases</h1>

------

## Intro

<p style="font-size: 0.8em;">Welcome to the Healthcare Fraud Database, a comprehensive resource compiling information on fraudulent activities within the healthcare industry. Based on my experience in healthcare startup, interactions with investors, executives, much of the fraud is overlooked as "part of business". This database serves as a centralized repository of reported cases and schemes, sourced primarily from news articles, press releases, Department of Justice reports, and Federal Trade Commission announcements. This website is currently work-in-progress, as the data validation is ongoing. </p>

```js
const search_input = Inputs.search(data, {placeholder: "Search cases"});
```

```js
const search_result = Generators.input(search_input);
```

```js
// Clinician Type selector
const clinician_type_select = Inputs.select(
    data.map((d) => d.clinicianType),
    {
        label: "Type", 
        sort: true,
        value: data.map((d) => d.clinicianType), 
        multiple: 6,
        width: 300,
        unique: true}
  );
const clinician_type = Generators.input(clinician_type_select)
```

```js
const filtered_data = search_result.filter(d => [...clinician_type].includes(d.clinicianType));
```

<!-- ```js
Plot.plot({
  projection: "albers-usa",
  color: {
    type: "quantile",
    n: 9,
    scheme: "blues",
    label: "Unemployment (%)",
    legend: true
  },
  marks: [
    Plot.geo(counties, {
      fill: "unemployment",
      title: (d) => `${d.properties.name} ${d.properties.unemployment}%`,
      tip: true
    })
  ]
}) -->
<!-- ``` -->

------

## Search

${search_input}

${clinician_type_select}

---

## Statistics

```js
const aggregateData = function(data) {
  const aggregatedData = {};
  data.forEach(item => {
    if (aggregatedData[item.state]) {
      aggregatedData[item.state] += item.fraudAmount;
    } else {
      aggregatedData[item.state] = item.fraudAmount;
    }
  });

  // Convert the aggregated data to the desired array format
  return Object.entries(aggregatedData).map(([state, fraudAmount]) => ({
    state,
    fraudAmount
  }));
}
```

```js
const state_bar_plot = function(data) {
  const aggregated_data = aggregateData(data)
  return Plot.plot({
  marginTop: 0,
  paddingTop: 0,
  marginLeft: 100, 
  // marginRight: 120, 
  marginBottom: 0,
  // height: 300,
  x: { axis: null },
  y: { label: null },
  color: {
    scheme: "OrRd",
    legend: true,
  },
  marks: [
    Plot.barX(aggregated_data, {
      x: "fraudAmount",
      y: "state", 
      fill: "fraudAmount",
      sort: { y: "x", reverse: true, limit: 10 }
    }),
    Plot.text(aggregated_data, {
      text: d => `$${d3.format(".3s")(d.fraudAmount).replace(/G/, "B")}`,
      y: "state",
      x: "fraudAmount",
      textAnchor: "start",
      dx: 3,
      fill: "black"
    })
  ]
})


  }
```


<div class="grid grid-columns-2">
    <div class="card">
  <div class="stats-container">
      <div class="big-number-card">
          <div class="big-number">$${d3.format(".3s")(filtered_data.reduce((total, item) => {
      return (total + (Number(item.fraudAmount)) || 0);
    }, 0)).replace(/G/, "B")}</div>
          <div class="big-number-caption">Total Fraud Amount</div>
      </div>
      <div class="big-number-card">
          <div class="big-number">${filtered_data.length}</div>
          <div class="big-number-caption">Cases</div>
      </div>
  </div>
  <hr>
  <h2>Total Fraud Amount by State</h2>
    ${state_bar_plot(filtered_data)}
    </div>
</div>

```js
const yearHeatmap = function(startYear, endYear, highlightStart, highlightEnd) {
  const years = d3.range(startYear, endYear + 1);
  const data = years.map(year => ({
    year,
    highlight: year >= highlightStart && year <= highlightEnd
  }));
  return Plot.plot({
    height: 45,
    // width: Math.min(800, window.innerWidth - 20),
    x: {
      type: "band", 
      domain: years, 
      padding: 0,
      label: null,  // Remove X-axis title
      tickSize: 0,  // Remove tick marks
      tickPadding: 3,  // Remove padding between ticks and labels
      tickFormat: d => d.toString()
    },
    y: {
      domain: [0, 1], 
      padding: 0.1,
      axis: null
    },
    color: {
      domain: [false, true],
      range: ["#f0f0f0", "#3182bd"]  // Light gray for non-highlighted, blue for highlighted
    },
    marks: [
      Plot.cell(data, {
        x: "year",
        fill: d => d.highlight,
        title: d => `Year: ${d.year}${d.highlight ? " (Highlighted)" : ""}`,
        stroke: "white",
        strokeWidth: 1
      }),
    ],
    style: {
      backgroundColor: "white",
      fontSize: "9px",
      fontColor: "#f0f0f0"
    },
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 30  // Add some bottom margin for year labels
  });
}
```



<!-- ### ${filtered_data.length} Cases Found -->

------

## Case Detail 

```js
const cardTemplate = (data) => html`<div class="fraud-card">
    <div class="card-header">
        <div class="case-title">${data.title}</div>
        <div class="case-number">${data.caseNumber}</div>
    </div>
    <div class="card-content">
        <div class="main-content">
            <div class="state-container">
                <span class="badge state-badge">${data.state}</span>
            </div>
            <div class="battle-container">
                    <div class="party-card winner">
                        <span class="party-label">Plaintiff:</span>
                        <div>${data.plaintiff}</div>
                    </div>
                    <div class="party-card">
                        <span class="party-label">Defendant:</span>
                        <div><span class="key-entity">${data.defendant ? (Array.isArray(data.defendant) ? data.defendant.join(', ') : data.defendant) : 'No defendant'}</span></div>
                    </div>
                </div>
            <div class="summary">
                ${data.summary}
            </div>
        </div>
        <div class="number-column">
            <div class="category">${data.category}</div>
            <div class="fraud-amount-container">
                <div class="number-label">Alleged Fraud</div>
                <div class="fraud-amount">$${d3.format(".2s")(data.fraudAmount).replace(/G/, "B")}</div>
            </div>
            <!-- <div class="number-label">${data.affectedLabel}</div> !-->
            <div>${data.affectedCount}</div>
            <h4>Related:</h4>
            <div class="related-links">
                ${data.relatedLinks.map(link => html`
                    <a href="${link.url}" class="related-link">${link.text}</a>
                `)}
            </div>
        </div>
    </div>
    <div class="card-footer">
        <div class="comment-content">
        ${data.commentary ? (Array.isArray(data.commentary) ? data.commentary.map(c => html`
            <div class="comment-admonition">
                ${c.comment} <b style="text-align: right;">- ${c.added_by}</b>
            </div>
        </div>`): data.commentary) : "" }
    </div>
    <div class="card-footer">
        <div class="timeline">
            <h4>Fraud Years:</h4>
            ${yearHeatmap(2014, 2024, data.timeline.start_year, data.timeline.end_year)}
        </div>
    </div>
</div>`;
```

```js
const data = FileAttachment("data/healthcare_frauds.json").json();
```

${filtered_data.map(entry => cardTemplate(entry))}


## References

- [ ] 2023 National Health Care Fraud Enforcement Action
- [ ] 2023 COVID-19 Enforcement Action
- [ ] 2022 Opioid Enforcement Action
- [x] [2022 Telemedicine Enforcement Action]
- [x] [2022 COVID-19 Enforcement Action](https://www.justice.gov/criminal/criminal-fraud/health-care-fraud-unit/2023-case-summaries)
- [ ] [2021 National Health Care Fraud Enforcement Action](https://www.justice.gov/criminal-fraud/health-care-fraud-unit/covid-19-health-care-fraud-enforcement-action)
