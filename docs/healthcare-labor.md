---
theme: ["air"]
title: Healthcare Labor Info
# toc: true
# style: accent-headers.css
sql:
    oes_db: ./data/oes/processed/oes_longitudinal_slim.parquet
---

# Healthcare Employment


------


```js
const occ_codes = FileAttachment("data/oes/processed/occ_code.csv").csv()
const naics_lookup = FileAttachment("data/oes/processed/naics_lookup_from_data.csv").csv()
```

```js
const occ_code_search_input = Inputs.search(occ_codes, {width: 100})
```

```js
const occ_code_search = Generators.input(occ_code_search_input)
```

```js
const occ_code_table_input = Inputs.table(
    occ_code_search,
)
```


```js
const occ_code_table_input_results = Generators.input(occ_code_table_input)
```

```js
const selected_codes = occ_code_table_input_results.map(d => d.OCC_CODE)
```

## 1. Healthcare Labor Statistics

Understanding healthcare employment trends provides a "bird's-eye view" of the industry's direction. As clinicians, we often focus solely on our own specialties. This page aims to make broader workforce data accessible, enabling us to grasp the bigger picture of rapidly evolving healthcare staffing patterns. 

By understanding which categories of healthcare professionals are growing or declining, we can better collaborate across disciplines and adapt to changing needs.

------ 

### Options for the Charts

```js
const grouping_limit_input = Inputs.range([0, 20], {step: 1, label: "Number of Categories", value: 4})
```

```js
const grouping_limit = Generators.input(grouping_limit_input)
```

```js
grouping_limit_input
```

------

## 2. Physicians

<div class="card" style="padding: 0">

- **Year 2004** counts ~160k physicians, suggesting data capture issues in the past.
- Notable dip during **COVID-19** years, 2019 and 2020.
- **Office of Physicians (NAICS 621100)** has a noticeable increase since 2021.

</div>

<hr style="padding: 0">

```js
const physicians = [
    // "29-1060",  // Deprecated, Physicians and Surgeons
    "29-1069",  // Deprecated, Physicians and surgeons, all other
    // "29-1210",  // Current, Physicians, entire group,
    "29-1211",
    "29-1212",
    "29-1213",
    "29-1214",
    "29-1215",
    "29-1216",
    "29-1217",
    "29-1218",
    "29-1221",
    "29-1222",
    "29-1223",
    "29-1224",
    // "29-1228",
    // "29-1229", // Physicians, all other
    // "29-1240", // Surgon group
    "29-1241",
    "29-1242",
    "29-1243",
    "29-1248",
    "29-1249",
]
```

<div>
${counts_plot(await get_naics_counts(physicians, grouping_limit))}
</div>


<div>
<b>Bureau of Labor Stats: Detailed Link</b>
${physicians.map(d => html`<li style="font-size: 0.8em"><a href="https://www.bls.gov/oes/current/oes${d.replace('-','')}.htm">${d}: ${lookup_occ_title(d)}</a></li>`)}
</div>

<hr style="padding: 0">

## 3. Registered Nurses

<div class="card" style="padding: 0">

- **Steady uptrend** from 2002 to 2023
- "Change"(?) of NAICS coding from **Nursing Care Facilities** to **Outpatient Care Centers**

</div>

<hr style="padding: 0">

```js
const nurses = [
    "29-1111",
    "29-1141",  // RN
]
```

<div>
${counts_plot(await get_naics_counts(nurses, grouping_limit))}
</div>

<div>
<b>Bureau of Labor Stats: Detailed Link</b>
${nurses.map(d => html`<li style="font-size: 0.8em"><a href="https://www.bls.gov/oes/current/oes${d.replace('-','')}.htm">${d}: ${lookup_occ_title(d)}</a></li>`)}
</div>

<hr style="padding: 0">

## 4. Nurse Practioners

<div class="card" style="padding: 0">

- **2.5x** number of increase in Nurse Practioners from 2012-2023.
- Increase across all NAICS industry classifications.
- **Office of Physicians** is largest group.

</div>

```js
const nurse_practioners = [
    "29-1171",  // NP
]
```

<div>
${counts_plot(await get_naics_counts(nurse_practioners, grouping_limit))}
</div>


<div>
<b>Bureau of Labor Stats: Detailed Link</b>
${nurse_practioners.map(d => html`<li style="font-size: 0.8em"><a href="https://www.bls.gov/oes/current/oes${d.replace('-','')}.htm">${d}: ${lookup_occ_title(d)}</a></li>`)}
</div>

<hr style="padding: 0">

## 5. Nurse Assistants

<div class="card" style="padding: 0">

- Steady-to-recent decline in **Nursing Assistant (31-1014, 31-1131)** occupation

</div>

```js
const nursing_assistants = [
    // "29-2061",  // LVN
    // "29-1151",  // Nurse Anesthetist
    // "31-1010",  // Nursing, Psychiatric, and Home Health Aides
    "31-1014",  // Nursing Assistants
    "31-1131",  // Nursing Assistants
]
```

<div>
${counts_plot(await get_naics_counts(nursing_assistants, grouping_limit))}
</div>


<div>
<b>Bureau of Labor Stats: Detailed Link</b>
${nursing_assistants.map(d => html`<li style="font-size: 0.8em"><a href="https://www.bls.gov/oes/current/oes${d.replace('-','')}.htm">${d}: ${lookup_occ_title(d)}</a></li>`)}
</div>

<hr style="padding: 0">

## 6. Physician Assistants

<div class="card" style="padding: 0">

- **More than 2x** growth of number of Physician Assistants from 2002 to 2023
- Mostly in **Office of Physicians** but growing in Hospitals and **Outpatient Care Centers**

</div>

```js
const physian_assistant = [
    "29-1071",  // 
]
```

<div>
${counts_plot(await get_naics_counts(physian_assistant, grouping_limit))}
</div>

<div>
<b>Bureau of Labor Stats: Detailed Link</b>
${physian_assistant.map(d => html`<li style="font-size: 0.8em"><a href="https://www.bls.gov/oes/current/oes${d.replace('-','')}.htm">${d}: ${lookup_occ_title(d)}</a></li>`)}
</div>


<hr style="padding: 0">

## 7. CRNA

<div class="card" style="padding: 0">

- CRNA (certified registered nurse anesthetist) numbers steadily increased since 2012

</div>

```js
const crna = [
    // "29-2061",  // LVN
    "29-1151",  // Nurse Anesthetist
    // "31-1010",  // Nursing, Psychiatric, and Home Health Aides
    // "31-1014",  // Nursing Assistants
    // "31-1131",  // Nursing Assistants
]
```


<div>
${counts_plot(await get_naics_counts(crna, grouping_limit))}
</div>


<div>
<b>Bureau of Labor Stats: Detailed Link</b>
${crna.map(d => html`<li style="font-size: 0.8em"><a href="https://www.bls.gov/oes/current/oes${d.replace('-','')}.htm">${d}: ${lookup_occ_title(d)}</a></li>`)}
</div>

```js
const counts_plot = function(data) {
    return Plot.plot({
        // marginTop: 0,
        // paddingTop: 0,
        paddingLeft: 10,
        marginLeft: 70, 
        marginRight: 50, 
        marginBottom: 30,
        // height: 350,
        fontSize: 10,
        width: 1000,
        color: {
            legend: true,
            scheme: "Tableau10"
        },
        legend: {
            tickFormat: lookup_occ_title
        },
        x: {
          type: "band"
        },
        // facet: {data, x: "NAICS", marginRight: 90},
        marks: [
            Plot.barY(data, {
                x: (d) => new Date(d.REPORT_DATE),
                y: "total_employment", 
                fill: (d) => lookup_naics_title(d.NAICS),
                tip: true,
                title: (d) => `${d.NAICS_TITLE}: (${d.NAICS})\n\nEmployment: ${d.total_employment}`
            }),
            Plot.ruleY([0])
        ]
    })}
```
<hr style="padding: 0">

# References

- NAICS: https://www.census.gov/naics/?48967
- Bureau of Labor Statistics (Occupational Employment and Wage Statistics): https://www.bls.gov/oes/tables.htm
- Bureau of Labor Statistics (Occupational Profiles) https://www.bls.gov/oes/current/oes_stru.htm

<hr style="padding: 0">

Feel free to explore [Occupation Explorer](/occupation-search) (also can click on the menu) which allows your to pick and choose and generation your own **OCC and NAICS group trends**.

Hit me up on LinkedIn if you have comments/question: https://www.linkedin.com/in/jung-hoon-son/

> Jung

------

```js
// Join selected codes, turn it into SQL-compatible string. Inefficient but works
const selected_codes_str = "\'" + selected_codes.join("','") + "\'"
```

```js
const sql_array_str = function (code_array) {
    const selected_codes_str = "\'" + code_array.join("','") + "\'"
    return selected_codes_str
}
```


```js
const lookup_occ_title = occ_code => 
  occ_codes.find(({ OCC_CODE }) => OCC_CODE === occ_code)?.OCC_TITLE;
```
```js
const lookup_naics_title = naics_code => 
  naics_lookup.find(({ NAICS }) => NAICS === naics_code)?.NAICS_TITLE ?? naics_code;
```

```js
const get_naics_counts = async function (selected_codes, grouping_limit=5) {
  const naics_occ_count = await sql([
    `WITH all_time_ranked_data AS (
  SELECT 
    NAICS,
    ANY_VALUE(NAICS_TITLE) AS NAICS_TITLE,
    SUM(TOT_EMP) AS all_time_total_employment,
    RANK() OVER (ORDER BY SUM(TOT_EMP) DESC) AS all_time_rank
  FROM oes_db
  WHERE OCC_CODE IN (${sql_array_str(selected_codes)}) 
    AND RIGHT(OCC_CODE, 1) != '0'
  GROUP BY NAICS
),
top_x_naics AS (
  SELECT NAICS
  FROM all_time_ranked_data
  WHERE all_time_rank <= ${grouping_limit}
),
monthly_data AS (
  SELECT 
    REPORT_DATE,
    NAICS,
    ANY_VALUE(NAICS_TITLE) AS NAICS_TITLE,
    SUM(TOT_EMP) AS total_employment
  FROM oes_db
  WHERE OCC_CODE IN (${sql_array_str(selected_codes)}) 
    AND RIGHT(OCC_CODE, 1) != '0'
  GROUP BY REPORT_DATE, NAICS
),
final_data AS (
  SELECT
    md.REPORT_DATE,
    CASE 
      WHEN txn.NAICS IS NOT NULL THEN md.NAICS 
      ELSE 'Other'
    END AS NAICS,
    CASE 
      WHEN txn.NAICS IS NOT NULL THEN md.NAICS_TITLE
      ELSE 'Other Industries'
    END AS NAICS_TITLE,
    SUM(md.total_employment) AS total_employment
  FROM monthly_data md
  LEFT JOIN top_x_naics txn ON md.NAICS = txn.NAICS
  GROUP BY 
    md.REPORT_DATE,
    CASE 
      WHEN txn.NAICS IS NOT NULL THEN md.NAICS 
      ELSE 'Other'
    END,
    CASE 
      WHEN txn.NAICS IS NOT NULL THEN md.NAICS_TITLE
      ELSE 'Other Industries'
    END
)
SELECT 
  REPORT_DATE,
  NAICS,
  NAICS_TITLE,
  total_employment
FROM final_data
ORDER BY 
  REPORT_DATE,
  CASE WHEN NAICS = 'Other' THEN 2 ELSE 1 END,
  total_employment DESC`
    ]);
  
  return await naics_occ_count
}
```