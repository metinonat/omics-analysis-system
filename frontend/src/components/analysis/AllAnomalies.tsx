"user client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Grid, TableFooter, TablePagination } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { TablePaginationActions } from "..";

function Row(props: { row: GeneAnalysis }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.gene}
        </TableCell>
        <TableCell align="right">{row.mean}</TableCell>
        <TableCell align="right">{row.stdDev}</TableCell>
        <TableCell align="right">{row.samples.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Sample</TableCell>
                    <TableCell align="right">Expression</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.samples.map((samplesRow) => (
                    <TableRow key={samplesRow._id}>
                      <TableCell component="th" scope="row">
                        {samplesRow.created}
                      </TableCell>
                      <TableCell>{samplesRow.name}</TableCell>
                      <TableCell align="right">{samplesRow.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function AllAnomaliesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState<Array<GeneAnalysis>>([]);

  useEffect(() => {
    fetch("http://localhost:8080/analysis/outliers/z-score", {
      method: "POST",
      body: JSON.stringify({
        threshold: 1,
        genes: [],
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result.data.data);
      })
      .catch((error) => console.error(error));
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
  console.log(
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0
  );
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
          <Table aria-label="custom pagination collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  <b>Genes</b>
                </TableCell>
                <TableCell align="right">
                  <b>Mean</b>
                </TableCell>
                <TableCell align="right">
                  <b>Median</b>
                </TableCell>
                <TableCell align="right">
                  <b>Standart Deviation</b>
                </TableCell>
                <TableCell align="right">
                  <b>Outlier Count</b>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: GeneAnalysis) => (
                <Row key={row.id} row={row} />
              ))}
              {data.length == 0 && (
                <TableRow style={{ height: 53 }}>
                  <TableCell colSpan={6}>
                    <Typography
                      sx={{ textAlign: "center" }}
                      variant="body1"
                      component="div"
                    >
                      No outliers found
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
    </Grid>
  );
}
