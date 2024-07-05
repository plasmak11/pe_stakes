---
theme: ["air"]
title: Healthcare Labor Info
# toc: true
# style: custom-style.css
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

Understanding the trends of healthcare emloyment patterns in a high-level view provides a "birds-eye view" of the direction of healthcare. 

As clinicians, we often end up in the bubble of our own clinical professions. I personally would like to make this page accessible because we all need to understand the bigger picture of rapidly growing (or declining) categories of healthcare staff in order to work together with each other.

------ 

## 2. Physicians

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

```js
const physicians_v2 = [
    "29-1060",  // Deprecated, Physicians and Surgeons
    // "29-1069",  // Deprecated, Physicians and surgeons, all other
    "29-1210",  // Current, Physicians, entire group,
    // "29-1211",
    // "29-1212",
    // "29-1213",
    // "29-1214",
    // "29-1215",
    // "29-1216",
    // "29-1217",
    // "29-1218",
    // "29-1221",
    // "29-1222",
    // "29-1223",
    // "29-1224",
    // "29-1228",
    // "29-1229", // Physicians, all other
    // "29-1240", // Surgon group
    // "29-1241",
    // "29-1242",
    // "29-1243",
    // "29-1248",
    // "29-1249",
]
```


```js
const grouping_limit_input = Inputs.range([0, 20], {step: 1, label: "Categories", value: 5})
```

```js
const grouping_limit = Generators.input(grouping_limit_input)
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
    `WITH ranked_data AS (
      SELECT 
        REPORT_DATE,
        NAICS,
        ANY_VALUE(NAICS_TITLE) AS NAICS_TITLE,
        SUM(TOT_EMP) AS total_employment,
        RANK() OVER (PARTITION BY REPORT_DATE ORDER BY SUM(TOT_EMP) DESC) AS rank
      FROM oes_db
      WHERE OCC_CODE IN (${sql_array_str(selected_codes)})
      GROUP BY REPORT_DATE, NAICS
    ),
    top_x_and_others AS (
      SELECT
        REPORT_DATE,
        CASE 
          WHEN rank <= ${grouping_limit} THEN NAICS 
          ELSE 'Other'
        END AS NAICS,
        SUM(total_employment) AS total_employment,
        ANY_VALUE(NAICS_TITLE) AS NAICS_TITLE
      FROM ranked_data
      GROUP BY 
        REPORT_DATE,
        CASE 
          WHEN rank <= ${grouping_limit} THEN NAICS 
          ELSE 'Other'
        END
    )
    SELECT 
      REPORT_DATE,
      NAICS,
      NAICS_TITLE,
      total_employment,
    FROM top_x_and_others
    ORDER BY 
      REPORT_DATE,
      CASE WHEN NAICS = 'Other' THEN 2 ELSE 1 END,
      total_employment DESC`
    ]);
  
  return await naics_occ_count
}
```


```js
grouping_limit_input
```

### Total Employment (2004-2023)

Bureau of Labor Statistics

<div>
${counts_plot(await get_naics_counts(physicians, grouping_limit))}
</div>

## 3. Nurses

```js
const nurses = [
    "29-1111",
    "29-1141",  // RN
]
```

<div>
${counts_plot(await get_naics_counts(nurses, grouping_limit))}
</div>



## 4. Nurse Practioners


```js
const nurse_practioners = [
    "29-1171",  // NP
]
```

<div>
${counts_plot(await get_naics_counts(nurse_practioners, grouping_limit))}
</div>



## 5. Nurse Assistants

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

## 6. Physician Assistants

```js
const physian_assistant = [
    "29-1071",  // 
]
```

<div>
${counts_plot(await get_naics_counts(physian_assistant, grouping_limit))}
</div>


## 7. CRNA

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



## Selected codes

```js
selected_codes
```

```js
const test = await get_naics_counts(selected_codes)
```

```js
await Inputs.table(test)
```

```js
const counts_plot = function(data) {
    return Plot.plot({
        // marginTop: 0,
        // paddingTop: 0,
        paddingLeft: 10,
        marginLeft: 120, 
        marginRight: 50, 
        marginBottom: 30,
        // height: 350,
        width: 1000,
        color: {
            legend: true,
            scheme: "Tableau10"
        },
        legend: {
            tickFormat: lookup_occ_title
        },
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

```js
// get_naics_counts(selected_codes)
```

------

## General Occupation Search

Bureau of Labor Statistics uses "OCC" codes to capture occupations in the U.S. for reporting purposes. Full list is here: https://www.bls.gov/oes/current/oes_stru.htm

<div style="padding: 0; overflow:hidden;">
    <div>${occ_code_search_input}</div>
    <div>${occ_code_table_input}</div>
</div>

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

${counts_plot(await get_naics_counts(selected_codes, grouping_limit))}
