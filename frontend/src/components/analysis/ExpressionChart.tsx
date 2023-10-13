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
} from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  Colors,
  LinearScale,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

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
Chart.register(CategoryScale, LinearScale, BarElement);

export default function ExpressionChart() {
  const [geneList, setGeneList] = React.useState<Gene[]>([]);
  const [selectedGenes, setSelectedGenes] = React.useState<string[]>([]);
  const [genes, setGenes] = React.useState<
    ChartData & { max: number; min: number }
  >({
    labels: [],
    datasets: [],
    max: 0,
    min: 0,
  });

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

  const fetchGenesToDisplay = () => {
    const url = "http://localhost:8080/analysis/chart-data";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        genes: selectedGenes,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setGenes(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    fetchGenesToDisplay();
  }, [selectedGenes]);
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
      </Grid>
      <Bar
        data={{ labels: genes.labels, datasets: genes.datasets }}
        options={{
          scales: {
            y: {
              suggestedMin: genes.min,
              suggestedMax: genes.max,
            },
          },
          plugins: {
            colors: {
              forceOverride: true,
            },
            legend: {
              display: true,
              align: "end",
              position: "bottom",
              labels: {
                color: "black",
                font: {
                  size: 14,
                },
              },
            },
          },
        }}
      />
      <br />
      <br />
      <Grid color="black">
        <p color="black">
          * Genes without any samples data is indicated with -1 on the chart if
          they selected with other genes.
        </p>
      </Grid>
    </>
  );
}
