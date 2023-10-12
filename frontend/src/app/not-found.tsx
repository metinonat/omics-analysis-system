import { Grid } from "@mui/material";

export default function NotFound() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={3} color={"black"}>
        <h2>404 | This page could not be found.</h2>
      </Grid>
    </Grid>
  );
}
