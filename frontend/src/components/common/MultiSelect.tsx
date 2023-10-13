"use client";
import { SearchBar } from "@/components";
import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Chart, Colors } from "chart.js";
import React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultiSelectProps {
  dataFetchUrl: string;
  setData: (data: any) => void;
  useThreshold?: boolean;
}

export default function MultiSelect(props: MultiSelectProps) {
  const { dataFetchUrl, setData, useThreshold } = props;
  const [geneList, setGeneList] = React.useState<Gene[]>([]);
  const [selectedGenes, setSelectedGenes] = React.useState<string[]>([]);
  const [threshold, setThreshold] = React.useState<string>("1.00");

  Chart.register(Colors);
  const handleChange = (event: SelectChangeEvent<typeof selectedGenes>) => {
    const {
      target: { value },
    } = event;
    setSelectedGenes(typeof value === "string" ? value.split(",") : value);
  };

  const fetchGenesList = (filter?: string) => {
    const url = filter
      ? "http://localhost:8080/omics/list/input?filter=" + filter
      : "http://localhost:8080/omics/list/input";
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setGeneList(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  let body: { genes: string[]; threshold?: number } = {
    genes: selectedGenes,
  };
  if (useThreshold) body.threshold = parseFloat(threshold);
  const fetchGenesToDisplay = () => {
    fetch(dataFetchUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        setData(await response.json());
      })
      .catch(async (error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    fetchGenesToDisplay();
  }, [selectedGenes, threshold]);
  React.useEffect(() => {
    fetchGenesList();
  }, []);
  return (
    <>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid>
          <SearchBar search={fetchGenesList} label="Filter Genes" />
        </Grid>
        <Grid>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="omics-multi-checkbox-label">
              Omics to Display on Chart
            </InputLabel>
            <Select
              labelId="omics-multi-checkbox-label"
              id="omics-multi-checkbox"
              multiple
              value={selectedGenes}
              onChange={handleChange}
              input={<OutlinedInput label="Omics to Display on Chart" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {geneList && geneList.length > 0
                ? geneList.map((gene) => (
                    <MenuItem key={gene._id} value={gene.gene}>
                      <Checkbox
                        checked={selectedGenes.indexOf(gene.gene) > -1}
                      />
                      <ListItemText primary={gene.gene} />
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </Grid>
        {useThreshold && (
          <Grid>
            <TextField
              id="threshold"
              label="Threshold"
              variant="standard"
              placeholder="1"
              onChange={(event) => {
                setThreshold(event.target.value);
                fetchGenesToDisplay();
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*.[0-9]*",
              }}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
