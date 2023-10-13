"use client";
import { Grid } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  Colors,
  LinearScale,
} from "chart.js";
import React, { use } from "react";
import { Bar } from "react-chartjs-2";
import MultiSelect from "../common/MultiSelect";

Chart.register(CategoryScale, LinearScale, BarElement);

export default function ExpressionChart() {
  const [genes, setGenes] = React.useState<
    ChartData & { max: number; min: number }
  >({
    labels: [],
    datasets: [],
    max: 0,
    min: 0,
  });

  React.useEffect(() => {
    console.log(genes)
  }, [genes])

  Chart.register(Colors);
  return (
    <>
      <MultiSelect
        dataFetchUrl="http://localhost:8080/analysis/chart-data"
        setData={setGenes}
        useThreshold={false}
      />
      <Bar
        data={{ labels: genes?.labels, datasets: genes?.datasets as any }}
        options={{
          scales: {
            y: {
              suggestedMin: genes?.min,
              suggestedMax: genes?.max,
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
