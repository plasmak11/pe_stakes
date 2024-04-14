import polars as pl
import sys


# Seems like the location is relative to the packson.json file
pe_hospitals = (
    pl.read_csv("docs/dataloaders/data/pe-hospital-tracker.csv", infer_schema_length=100000)
)

state_fips = (
    pl.read_json("docs/dataloaders/data/state-fips.json")
    .select(pl.col("state").alias("State"), "fips")
)

df = pe_hospitals.join(state_fips, on="State", how="left")

df.write_csv(sys.stdout)
