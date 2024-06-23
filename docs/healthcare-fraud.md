---
theme: [coffee]
title: Healthcare Fraud
toc: false
style: custom-style.css
---

# Healthcare Fraud Database

<!-- ## Telemedicine Case Summaries -->

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


## Cases

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
        </div>
        <div class="number-column">
            <div class="category">${data.category}</div>
            <div class="fraud-amount-container">
                <div class="number-label">Alleged Fraud</div>
                <div class="fraud-amount">$${d3.format(".2s")(data.fraudAmount)}</div>
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
        <div class="timeline">
            <h4>Years:</h4>
            ${yearHeatmap(2014, 2024, data.timeline.start_year, data.timeline.end_year)}
        </div>
    </div>
</div>`;
```

```js
const data = new Array({
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
    category: 'Genetic Testing',
    fraudAmount: 93000000,
    affectedLabel: 'Beneficiaries Affected',
    // affectedCount: "Unknown",
    }, 
    {
  "title": "United States v. Luis Lacerda",
  "caseNumber": "Case Number: Unknown",
  "state": "Florida",
  "plaintiff": "United States Department of Justice",
  "defendant": "Luis Lacerda",
  "summary": "Luis Lacerda, 35, of Fort Lauderdale, Florida, was charged by information for his role in a health care fraud scheme that resulted in Medicare payments of approximately $54.3 million. Lacerda was the owner of pharmacies in several states, including Cure Pharmacy in Jacksonville, Florida. From in or around 2017 through in or around 2021, Lacerda, through his call center and through the payment of kickbacks and bribes to telemarketing companies, targeted Medicare beneficiaries and encouraged them to accept expensive prescription medications they neither wanted nor needed. He also paid kickbacks and bribes to purported telemedicine companies to obtain signed prescriptions from physicians who had no relationship with the patients, rarely spoke to them, and made no determination of the medical necessity of the prescriptions. Through his pharmacy network, Lacerda caused false and fraudulent claims for the medications to be submitted to Medicare Part D plans. The case is being prosecuted by Trial Attorney Gary Winters of the National Rapid Response Strike Force and Assistant United States Attorney David Mesrobian of the Middle District of Florida.",
  "timeline": {
    "start_year": 2017,
    "end_year": 2021
  },
  "violation": [
    "42 U.S. Code § 1320a–7b"
  ],
  "relatedLinks": [
    {"url": "https://www.law.cornell.edu/uscode/text/42/1320a-7b", "text": "42 U.S. Code § 1320a–7b"},
    {"url": "#", "text": "Health Care Fraud"},
    {"url": "#", "text": "Kickbacks"},
    {"url": "#", "text": "Bribes"}
  ],
  "category": "Health Care Fraud",
  "fraudAmount": 54300000,
  "affectedLabel": "Beneficiaries Affected"
},
    {
  "title": "United States v. Vincent R. Sperti II",
  "caseNumber": "Case Number: Unknown",
  "state": "Florida",
  "plaintiff": "United States Department of Justice",
  "defendant": "Vincent R. Sperti II",
  "summary": "Vincent R. Sperti II, 43, of Oviedo, Florida, was charged by information for his involvement in an approximately $400,000 kickback scheme and with possession with intent to distribute a controlled substance. Between in or around September 2018 and in or around September 2019, Sperti worked with a purported marketing company that purchased and resold doctors' orders for braces for Medicare beneficiaries. Sperti and his co-conspirators also purchased Medicare beneficiaries' personally identifiable information and purported personal health information and paid kickbacks and bribes to purported telemedicine companies to obtain signed doctors' orders. Additionally, on or about September 30, 2020, Sperti was found in possession of a large volume of illegal steroids, a Schedule III controlled substance. The case is being prosecuted by Trial Attorney Catherine Wagner of the National Rapid Response Strike Force.",
  "timeline": {
    "start_year": 2018,
    "end_year": 2019
  },
  "violation": [
    "42 U.S. Code § 1320a–7b",
    "21 U.S. Code § 841"
  ],
  "relatedLinks": [
    {"url": "https://www.law.cornell.edu/uscode/text/42/1320a-7b", "text": "42 U.S. Code § 1320a–7b"},
    {"url": "https://www.law.cornell.edu/uscode/text/21/841", "text": "21 U.S. Code § 841"},
    {"url": "#", "text": "Kickbacks"},
    {"url": "#", "text": "Controlled Substances"}
  ],
  "category": "Kickback Scheme and Drug Possession",
  "fraudAmount": 400000,
  "affectedLabel": "Beneficiaries Affected"
},
{
  "title": "United States v. Luis Perez and Jestil Tapia",
  "caseNumber": "Case Number: Unknown",
  "state": "Florida",
  "plaintiff": "United States Department of Justice",
  "defendant": "Luis Perez and Jestil Tapia",
  "summary": "Luis Perez, 35, of Coral Springs, Florida, and Jestil Tapia, 28, of Parkland, Florida, were charged by indictment with conspiracy to defraud the United States and to pay and receive health care kickbacks and payment of kickbacks in connection with a federal health care program. Perez also was charged with conspiracy to commit health care fraud, health care fraud, and misusing COVID-19 relief funds to pay an approximately $85,000 payment to a luxury car dealership. From in or around January 2019 through in or around August 2020, Perez and Tapia owned and operated a network of DME and marketing companies they used to submit over $18 million in false and fraudulent claims to Medicare for DME, of which over $8 million was paid by Medicare. They submitted false enrollment records, inserted nominee owners of certain DME companies to conceal their interests, paid kickbacks to purported telemedicine and marketing companies, and profited millions from the scheme. The case is being prosecuted by Trial Attorney Patrick Queenan of the Miami Strike Force and Trial Attorney Catherine Wagner of the National Rapid Response Strike Force.",
  "timeline": {
    "start_year": 2019,
    "end_year": 2020
  },
  "violation": [
    "42 U.S. Code § 1320a–7b",
    "18 U.S. Code § 1347",
    "18 U.S. Code § 371"
  ],
  "relatedLinks": [
    {"url": "https://www.law.cornell.edu/uscode/text/42/1320a-7b", "text": "42 U.S. Code § 1320a–7b"},
    {"url": "https://www.law.cornell.edu/uscode/text/18/1347", "text": "18 U.S. Code § 1347"},
    {"url": "https://www.law.cornell.edu/uscode/text/18/371", "text": "18 U.S. Code § 371"},
    {"url": "#", "text": "Health Care Fraud"},
    {"url": "#", "text": "Kickbacks"},
    {"url": "#", "text": "COVID-19 Relief Fraud"}
  ],
  "category": "Health Care Fraud and COVID-19 Relief Fraud",
  "fraudAmount": 18000000,
  "affectedLabel": "Beneficiaries Affected"
},
{
  "title": "United States v. Lucia Miranda Oro Taboada",
  "caseNumber": "Case Number: Unknown",
  "state": "Florida",
  "plaintiff": "United States Department of Justice",
  "defendant": "Lucia Miranda Oro Taboada",
  "summary": "Lucia Miranda Oro Taboada, 27, of Boca Raton, Florida, was charged by indictment for her role in a health care fraud and wire fraud conspiracy. From in or around April 2020 to in or around November 2020, Oro allegedly conspired with others to operate two DME companies used to fraudulently bill Medicare over $1.7 million. Oro executed and submitted false enrollment records with Medicare concealing from Medicare the ownership interest and managing control of two co-conspirators, one of whom was a convicted felon. Oro also controlled the banking activities and transferred fraud proceeds from the DME companies to accounts owned and controlled by the beneficial owners. The case is being prosecuted by Trial Attorney Patrick Queenan of the Miami Strike Force.",
  "timeline": {
    "start_year": 2020,
    "end_year": 2020
  },
  "violation": [
    "18 U.S. Code § 1347",
    "18 U.S. Code § 1343",
    "18 U.S. Code § 371"
  ],
  "relatedLinks": [
    {"url": "https://www.law.cornell.edu/uscode/text/18/1347", "text": "18 U.S. Code § 1347"},
    {"url": "https://www.law.cornell.edu/uscode/text/18/1343", "text": "18 U.S. Code § 1343"},
    {"url": "https://www.law.cornell.edu/uscode/text/18/371", "text": "18 U.S. Code § 371"},
    {"url": "#", "text": "Health Care Fraud"},
    {"url": "#", "text": "Wire Fraud"}
  ],
  "category": "Health Care Fraud and Wire Fraud",
  "fraudAmount": 170000000,
  "affectedLabel": "Beneficiaries Affected"
}
);
```

${data.map(entry => cardTemplate(entry))}
