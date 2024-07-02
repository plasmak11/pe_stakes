---
theme: [wide]
title: Healthcare Fraud
# toc: true
style: custom-style-v2.css
---

# Healthcare Fraud Report

<!-- ## Telemedicine Case Summaries -->


```js
const yearHeatmap = function(startYear, endYear, highlightStart, highlightEnd) {
  const years = d3.range(startYear, endYear + 1);
  const data = years.map(year => ({
    year,
    highlight: year >= highlightStart && year <= highlightEnd
  }));
  return Plot.plot({
    height: 50,
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

```js
const cardTemplate = (data) => html`<div class="card">
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
                        <div><span class="key-entity">${data.defendant}</span></div>
                    </div>
                </div>
            <div class="summary">
                ${data.summary}
            </div>
            <div class="timeline">
                ${yearHeatmap(2014, 2024, data.timeline.start_year, data.timeline.end_year)}
            </div>
            <div class="related-links">
                <h4>Related:</h4>
                ${data.relatedLinks.map(link => html`
                    <a href="${link.url}" class="related-link">${link.text}</a>
                `)}
            </div>
        </div>
        <div class="number-column">
            <div class="category">${data.category}</div>
            <div class="fraud-amount-container">
                <div class="number-label">Alleged Fraud</div>
                <div class="fraud-amount">${d3.format(".2s")(data.fraudAmount)}</div>
            </div>
            <div class="number-label">${data.affectedLabel}</div>
            <div>${data.affectedCount}</div>
        </div>
    </div>
</div>`;
```


```js
const cardTemplateV2 = (data) => html`<div class="card" x-data="{ expanded: true }">
        <div class="card-header">
            <div class="header-left">
                <div class="case-title">${data.title}</div>
                <div class="case-number">${data.caseNumber}</div>
            </div>
            <div class="header-center">
                <div class="fraud-categories">
                    ${data.category.map(category => html`
                        <span class="fraud-category"><a href="${category.link}" class="fraud-category">${category.text}</a></span>
                    `)}
                </div>
            </div>
            <div class="fraud-column">
                <div class="fraud-label">Alleged Fraud</div>
                <div class="fraud-amount">${d3.format(".2s")(data.fraudAmount)}</div>
            </div>
            <div class="toggle-icon">▼</div>
        </div>
        <div class="card-content">
            <span class="state-badge">${data.state}</span>
            <div class="battle-container">
                <div class="party-card winner">
                    <span class="party-label">Plaintiff:</span>
                    <div>${data.plaintiff}</div>
                    <span class="winner-label">Winner</span>
                </div>
                <div class="party-card">
                    <span class="party-label">Defendant:</span>
                    <div><span class="key-entity">${data.defendant}</span></div>
                </div>
            </div>
            <div class="summary">
                ${data.summary}
            </div>
            <div class="related-links">
                <h4>Related:</h4>
                <a href="#" class="related-link">MedSupply Corp</a>
                <a href="#" class="related-link">Medicare Fraud</a>
                <a href="#" class="related-link">DME Cases</a>
                <a href="#" class="related-link">Telemedicine Fraud</a>
            </div>
        </div>
    </div>`;
```

```js
const caseData1 = {
    title: 'United States v. Tara Pendergraft',
    caseNumber: 'Case Number: 22-cr-00488-BRM',
    state: 'New Jersey',
    plaintiff: 'United States Department of Justice',
    defendant: 'Tara Pendergraft',
    summary: 'Tara Pendergraft, 45, of Chalfont, Pennsylvania, was charged by information for conspiring with others to defraud Medicare by billing for genetic testing that was medically unnecessary, ineligible for reimbursement, not provided as represented, and/or procured through kickbacks and bribes. Pendergraft, a laboratory owner, caused more than $93 million in fraudulent claims to be submitted to Medicare. Medicare paid approximately $14.3 million based on these claims. The case is being prosecuted by Acting Assistant Chief Rebecca Yuan and Trial Attorney S. Babu Kaza of the National Rapid Response Strike Force.',
    timeline: {
        "start_year": 2018,
        "end_year": 2019
    },
    violation: [
        "42 U.S. Code § 1320a–7b"
    ],
    relatedLinks: [
        {url: 'https://www.law.cornell.edu/uscode/text/42/1320a-7b', text: '42 U.S. Code § 1320a–7b'},
        {url: '#', text: 'Genetic Testing'},
        {url: '#', text: 'Kickbacks'},
        {url: '#', text: 'Bribes'}
    ],
    category: [
        {link: '#', text: 'Genetic Testing'},
        {link: '#', text: 'Telemedicine'},
    ],
    fraudAmount: 93000000,
    affectedLabel: 'Beneficiaries Affected',
    affectedCount: "Unknown",
};

const caseData2 = {
    title: 'FTC v. TeleHealth Solutions, Inc.',
    caseNumber: 'Case No. 2022-CV-98765',
    state: 'California',
    plaintiff: 'Federal Trade Commission',
    defendant: 'TeleHealth Solutions, Inc.',
    summary: 'FTC alleges TeleHealth Solutions, Inc. engaged in deceptive practices, misrepresenting qualifications of medical professionals, efficacy of remote diagnostics, and billing for unrendered services. The company contests all claims, asserting industry-standard compliance and pioneering healthcare access through technology.',
    timeline: {
        "start_year": 2020,
        "end_year": 2022
    },
    relatedLinks: [
        {url: '#', text: 'TeleHealth Solutions'},
        {url: '#', text: 'Telemedicine Fraud'},
        {url: '#', text: 'FTC Cases'}
    ],
    category: 'Telemedicine',
    fraudAmount: '$75M',
    affectedLabel: 'Patients Affected',
    affectedCount: null,
};
```

```js
cardTemplate(caseData1)
```

```js
cardTemplateV2(caseData1)
```


```js
const startYear = Inputs.number({label: "Start Year", value: 2010, step: 1});
const endYear = Inputs.number({label: "End Year", value: 2023, step: 1});
```

${startYear}

${endYear}

```js
const startYearValue = Generators.input(startYear);
const endYearValue = Generators.input(endYear);
```

${startYearValue}
${endYearValue}

```js
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        header.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
});
```