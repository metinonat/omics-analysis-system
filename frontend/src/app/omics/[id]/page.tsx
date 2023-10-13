"use client";

import { Copyright, Title } from "@/components";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";
export type OmicsData = Gene & {
  samples: Sample[];
};
export type GeneAnalysisResponse = {
  sampleSize: number;
  mean: number;
  median: number;
  variance: number;
  standartDeviation: number;
};

export default function OmicsDetail() {
  const params = useParams();
  const [analysis, setAnalysis] = React.useState<GeneAnalysisResponse>({
    mean: 0,
    median: 0,
    sampleSize: 0,
    standartDeviation: 0,
    variance: 0,
  });
  const [data, setData] = React.useState<OmicsData>({
    _id: "",
    gene: "",
    transcript: "",
    samples: [],
  });

  React.useEffect(() => {
    fetch(`http://localhost:8080/omics?geneId=${params.id}`)
      .then(async (response) => {
        setData(await response.json());
      })
      .catch((error) => console.error(error));
    fetch(`http://localhost:8080/analysis/gene/${params.id}`)
      .then(async (response) => {
        setAnalysis(await response.json());
      })
      .catch((error) => console.error(error));
  });
  return (
    <>
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 260,
              }}
            >
              <List>
                <ListItem>
                  <Typography sx={{ marginRight: 5 }}>Sample size</Typography>
                  <ListItemText primary={analysis?.sampleSize}></ListItemText>
                </ListItem>
                <ListItem>
                  <Typography sx={{ marginRight: 5 }}>Mean</Typography>
                  <ListItemText primary={analysis?.mean}></ListItemText>
                </ListItem>
                <ListItem>
                  <Typography sx={{ marginRight: 5 }}>Median</Typography>
                  <ListItemText primary={analysis?.median}></ListItemText>
                </ListItem>
                <ListItem>
                  <Typography sx={{ marginRight: 5 }}>Variance</Typography>
                  <ListItemText primary={analysis?.variance}></ListItemText>
                </ListItem>
                <ListItem>
                  <Typography sx={{ marginRight: 5 }}>
                    Standart Deviation
                  </Typography>
                  <ListItemText
                    primary={analysis?.standartDeviation}
                  ></ListItemText>
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 260,
              }}
            >
              <List>
                <ListItem>
                  <Typography sx={{ marginRight: 5 }}>
                    <b>Gene:</b>
                  </Typography>
                  <ListItemText primary={data?.gene}></ListItemText>
                </ListItem>
                <Typography sx={{ marginRight: 5 }}>
                  <b>Transcripts:</b>
                </Typography>
                {data?.transcript[0] &&
                  data?.transcript[0].split(",").map((trx) => {
                    return (
                      <Typography sx={{ marginLeft: 2 }} key={trx}> {trx}</Typography>
                    );
                  })}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Title>Samples</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Expression Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.samples &&
                    data.samples.map((sample: Sample) => (
                      <TableRow key={sample._id}>
                        <TableCell>
                          {new Date(sample.created).toLocaleString()}
                        </TableCell>
                        <TableCell>{sample.name}</TableCell>
                        <TableCell align="right">{`${sample.value}`}</TableCell>
                      </TableRow>
                    ))}
                  {!data?.samples ||
                    (data.samples.length == 0 && (
                      <TableRow>
                        <TableCell>No samples found.</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
            <Copyright sx={{ pt: 4 }} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
