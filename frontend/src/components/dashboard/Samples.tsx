import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import Title from "../common/Title";

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  gene: string,
  value: number
) {
  return { id, date, name, gene, value };
}

const rows = [
  createData(0, "16 Mar, 2019", "chow.dbl.rep1", "Gene1", 12.44),
  createData(1, "16 Mar, 2019", "chow.dbl.rep2", "Gene1", 1.4),
  createData(2, "16 Mar, 2019", "chow.J1c.rep1", "Gene1", 0.4),
  createData(3, "15 Mar, 2019", "chow.J1c.rep2", "Gene1", 6.2),
];

export default function Samples() {
  return (
    <React.Fragment>
      <Title>Recent Samples</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Gene</TableCell>
            <TableCell align="right">Expression Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.gene}</TableCell>
              <TableCell align="right">{`${row.value}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link
        color="primary"
        href={"/genes"}
        component="a"
        align="right"
        sx={{ mt: 3 }}
      >
        See more Samples
      </Link>
    </React.Fragment>
  );
}
