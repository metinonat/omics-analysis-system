"use client";
import {
  Alert,
  Grid,
  TableFooter,
  TablePagination,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useEffect } from "react";
import { AddSampleButton, TablePaginationActions } from "..";
import SearchBar from "../common/SearchBar";

export default function SamplesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);

  let error = false;

  const fetchSamples = (filter?: string) => {
    const url = filter
      ? `http://localhost:8080/samples/list?filterName=${filter}`
      : "http://localhost:8080/samples/list";
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.error(error);
        error = true;
        setTimeout(() => {
          error = false;
        }, 5000);
      });
  };
  useEffect(() => {
    fetchSamples();
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ overflow: "auto", maxHeight: "100vh" }}
    >
      <Grid sx={{ position: "absolute", top: "10vh", bottom: "10vh" }}>
        <TableContainer sx={{ minWidth: "70vw" }} component={Paper}>
          <Table aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <SearchBar search={fetchSamples} />
                </TableCell>
                <TableCell colSpan={3} align="right">
                  <AddSampleButton
                    label="New Sample"
                    fetchSamples={fetchSamples}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Sample Name</b>
                </TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell align="right">
                  <b>Gene</b>
                </TableCell>
                <TableCell align="right">
                  <b>Value</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: Sample) => (
                <TableRow key={row._id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {new Date(row.created).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{row.gene}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
              {data.length == 0 && (
                <TableRow style={{ height: 53 }}>
                  <TableCell colSpan={12}>
                    <Typography
                      sx={{ textAlign: "center" }}
                      variant="body1"
                      component="div"
                    >
                      No Sample Record Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
      <Alert severity="error" action={error}>
        This is an error alert — check it out!
      </Alert>
    </Grid>
  );
}
