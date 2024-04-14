---
theme: [light]
toc: true
---


# Project: PE Hospitals Tracker Tutorial

------

# Step 1 - Dataloaders Basics

Note that `Observable` likes to show the result output of the code first, followed by source code.

---

## 1.1 Write your dataloader

Data loaders is one of the most intriguing pieces of Observable Framework. It allows users to write, in any of the language supported (R, Python, shell script).

The dataloader code for this project is located in **`dataloaders/pe-hospital-tracker.csv.py`** .


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


## 1.2 PE Input selector

Select unique values of **`PE Firm`** from the **`pe_hospitals`** Array object.

```js echo
const pe_options = (
  pe_hospitals
  .filter(d => d['PE Firm'] !== null && d['PE Firm'].trim() !== '')
  .map((d) => d['PE Firm'])
)
```

------

Then display it using **`Input.select()`** with options to make it multi-selectable.

```js echo
Inputs.select(
  pe_options,
  {
    label: "PE Firm", 
    sort: true,       
    value: ["formerly Leonard Green & Partners"],
    multiple: 10,
    unique: true,
    width: "100%",
  }
)
```


## 1.3: Input

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
const pe_names = Generators.input(pe_names_input);
```


```js echo
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

// Assign the selected choices as an Array
const pe_hospital_table = Generators.input(pe_hospital_table_selection)
```
${pe_hospital_table_selection}