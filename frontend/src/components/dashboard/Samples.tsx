import { rateLimitedApiRequest } from "@/api/request";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Title from "../common/Title";

let lastRequestTime: number = Date.now() - 1000 * 60;

export default function Samples() {
  const [data, setData] = useState([]);

  useEffect(() => {
    rateLimitedApiRequest(lastRequestTime, () => {
      //@todo cannot get .env @see https://stackoverflow.com/questions/76280634/nextjs-app-not-read-environment-variables-from-docker-compose-yml
      axios
        .get(`http://localhost:8080/samples/list`)
        .then((res) => {
          setData(res.data.data);
        })
        .catch((error) => console.error(error));
    });
  }, []);
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
          {data.map((sample: Sample) => (
            <TableRow key={sample._id}>
              <TableCell>{new Date(sample.created).toLocaleString()}</TableCell>
              <TableCell>{sample.name}</TableCell>
              <TableCell>{sample.gene}</TableCell>
              <TableCell align="right">{`${sample.value}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link
        color="primary"
        href={"/samples"}
        component="a"
        align="right"
        sx={{ mt: 3 }}
      >
        See more Samples
      </Link>
    </React.Fragment>
  );
}
