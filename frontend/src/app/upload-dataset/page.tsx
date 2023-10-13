"use client";

import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File>();

  const onSubmit = async () => {
    if (!file) return;

    try {
      const data = new FormData();
      data.set("samples", file);

      const res = await fetch("http://localhost:8080/import/tsv", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });
      if (res.status !== 200)
        alert(
          JSON.stringify((await res.json()).message) ||
            "Something went wrong. Please try again later."
        );
    } catch (e: any) {
      // Handle errors here
      alert(JSON.stringify("Something went wrong. Please try again later."));
      console.error(e);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={8} color={"black"}>
        <Card
          sx={{
            minHeight: "30vh",
            minWidth: "30vw",
            padding: "5vh 5vw 10vh 5vw",
          }}
        >
          <form onSubmit={onSubmit} id="dataset-upload">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    style={{ borderBottomColor: "white" }}
                  >
                    <h1>
                      <b>Upload Dataset in tsv Format</b>
                    </h1>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ borderBottomColor: "white" }}>
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => setFile(e.target.files?.[0])}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="right"
                    style={{ borderBottomColor: "white" }}
                  >
                    <button
                      className="bg-black hover:bg-slate-800 text-white text-sm font-medium p-2 rounded "
                      type="button"
                      onClick={onSubmit}
                    >
                      <>Submit</>
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
}
