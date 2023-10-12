"use client";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Alert, Grid, TableFooter, TablePagination } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useEffect } from "react";
import CreateButton from "../common/Button";
import SearchBar from "../common/SearchBar";
import { TablePaginationActions } from "..";

export default function SamplesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  let error = false;

  useEffect(() => {
    // Fetch data from an API or other source on the client side
    fetch("http://localhost:8080/samples/list")
      .then((response) => response.json())
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.error(error);
        error = true;
        setTimeout(() => { error = false;} , 5000);
      });
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

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
                  <SearchBar />
                </TableCell>
                <TableCell align="right">
                  <CreateButton label="New Sample" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Sample Name</b>
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
                  <TableCell align="right">{row.gene}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
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
      <Alert severity="error" action={error}>This is an error alert — check it out!</Alert>
    </Grid>
  );
}
