"user client";

import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Grid, Link, TableFooter, TablePagination } from "@mui/material";
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
import { AddOmicsButton, SearchBar, TablePaginationActions } from "..";

function Row(props: { row: Gene & { samples: Sample[] } }) {
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
        <TableCell align="right">{row.transcript}</TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            component={Link}
            LinkComponent={"a"}
            href={`omics/${row._id}`}
          >
            {<InfoIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History (Last 10 Samples)
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
                  {(row.samples.length > 10
                    ? row.samples.slice(0, 10)
                    : row.samples
                  ).map((samplesRow) => (
                    <TableRow key={samplesRow._id}>
                      <TableCell component="th" scope="row">
                        {samplesRow.created}
                      </TableCell>
                      <TableCell>{samplesRow.name}</TableCell>
                      <TableCell align="right">{samplesRow.value}</TableCell>
                    </TableRow>
                  ))}
                  {row.samples.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          component="div"
                          sx={{ textAlign: "center" }}
                        >
                          No Sample Found for this Gene
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function GenesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);

  const fetchOmics = (filter?: string) => {
    const url = filter
      ? `http://localhost:8080/omics/list?filter=${filter}`
      : "http://localhost:8080/omics/list";
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    fetchOmics();
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
          <Table aria-label="custom pagination collapsible table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="left">
                  <SearchBar search={fetchOmics} label="Search Genes"/>
                </TableCell>
                <TableCell colSpan={4} align="right">
                  <AddOmicsButton label="New Omics" fetchOmics={fetchOmics} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell colSpan={2}>
                  <b>Genes</b>
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <b>Transcript</b>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: Gene & { samples: Sample[] }) => (
                <Row key={row._id} row={row} />
              ))}
              {data.length === 0 && (
                <TableRow style={{ height: 53 }}>
                  <TableCell colSpan={6}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      sx={{ textAlign: "center" }}
                    >
                      No Gene Found
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
