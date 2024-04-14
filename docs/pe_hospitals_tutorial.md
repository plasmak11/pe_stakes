---
theme: [light]
toc: true
---


# Tutorial: PE Hospitals Tracker

------

# 1 Dataloaders Basics

Note that `Observable` likes to show the result output of the code first, followed by source code.

---

## 1.1 Write your dataloader

Data loaders is one of the most intriguing pieces of Observable Framework. It allows users to write, in any of the language supported (R, Python, shell script).

The dataloader code for this project is located in **`dataloaders/pe-hospital-tracker.csv.py`** . I personally use Polars as my main data transformation. 

After examining the file, I found the data useful for but I need some sort of geospatial information. Two options:
- **FIPS code**: Allows choropleth maps since FIPS codes are mapped to polygons/shapefiles
- **Latitude/Longitude**: Allows pin-point


```py
import polars as pl
import sys

# Location is relative to the packson.json file
pe_hospitals = (
    pl.read_csv("docs/dataloaders/data/pe-hospital-tracker.csv", infer_schema_length=100000)
)

state_fips = (
    pl.read_json("docs/dataloaders/data/state-fips.json")
    .select(pl.col("state").alias("State"), "fips")
)

df = pe_hospitals.join(state_fips, on="State", how="left")

# Note the sys.stdout output, which is a requirement
df.write_csv(sys.stdout)
```

<div class="note">The magic of data loaders is that even though the file is a python file (**`.py`**), the data loader framework allows you to read this as if it's a CSV. 
</div>

-------



## 1.2 Load the dataloader

`FileAttachment()` can read either actual file or the dataloader-based file name re-routing (without the `.py` extension), as if you are loading a CSV file. Despite 


```js echo
const pe_hospitals = FileAttachment("dataloaders/pe-hospital-tracker.csv").csv({typed: true})
```

```js echo
pe_hospitals
```


  
---


## 1.3 Input selector

Select unique values of **`PE Firm`** from the **`pe_hospitals`** Array object. These are private equity firms.

```js echo
const pe_options = (
  pe_hospitals
  .filter(d => d['PE Firm'] !== null && d['PE Firm'].trim() !== '')
  .map((d) => d['PE Firm'])
)
```

#### `pe_options`

```js echo=False
pe_options
```

------


Then display it using **`Input.select()`** with options to make it multi-selectable with 10 rows displayed. 

Notes:

- **`multiple: false`** will result in a dropdown menu
- **`value: [default_selection]`** 


### Code

```js echo
const pe_firm_input = Inputs.select(
  pe_options,
  {
    label: "PE Firm", 
    sort: true,       
    value: ["formerly Leonard Green & Partners"],
    multiple: 10,
    unique: true,
    // width: "100%",
  }
)

// Generate an input based on the pe_names_input configuration
const selected_pe_names = Generators.input(pe_firm_input);
```

### Output

Simple calling the **`pe_firm_input`** and **`selected_pe_names`** within **\```js**\``` code blocks will generate these:

```js
pe_firm_input
```

```js echo=False
selected_pe_names
```

------

## 1.4: Interactive Table 

Using the selected names of the PEs, we can filter the JavaScript Array of **`pe_hospitals`**. I this the syntax will be unusual for python users but for people who've dabbled in JavaScript, the **``filter()``** and the hash rocket (=>) syntax translated as python/pandas will very similar to:

- Python/pandas: **`df.apply(lambda row: selected_pe_names in row['PE Firm'])`**


```js echo
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
        layout: "auto",
        required: false,
    })

// Assign the selected choices as an Array
const pe_hospitals_selected = Generators.input(pe_hospital_table)
```

### Output `pe_hospital_table`

${pe_hospital_table}