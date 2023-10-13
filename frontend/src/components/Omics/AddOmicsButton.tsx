"use client";
import { Modal } from "@mui/base/Modal";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Grid,
  Table,
  TableCell,
  TableFooter,
  TableRow,
  TextField,
} from "@mui/material";
import { Box, Theme, styled } from "@mui/system";
import clsx from "clsx";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Title } from "..";

const Backdrop = React.forwardRef<
  HTMLDivElement,
  { open?: boolean; className: string }
>(function BackdropFunc(props, ref) {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ "MuiBackdrop-open": open }, className)}
      ref={ref}
      {...other}
    />
  );
});

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme: Theme) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  width: "50vw",
  minHeight: 200,
  borderRadius: "12px",
  padding: "16px 32px 24px 32px",
  backgroundColor: theme.palette.mode === "dark" ? "#0A1929" : "white",
  boxShadow: `0px 2px 24px ${
    theme.palette.mode === "dark" ? "#000" : "#383838"
  }`,
});

type Inputs = {
  gene: string;
  transcript: number;
};

interface CreateButtonProps {
  label: string;
  fetchOmics: () => void;
}

export default function AddOmicsButton(props: CreateButtonProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { register, handleSubmit } = useForm<Inputs>();

  return (
    <div>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpen}>
        {props.label}
      </Button>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <Box sx={style}>
          <Title> Add A Gene </Title>
          <form
            onSubmit={handleSubmit(async function AddNewOmics(data) {
              const response = await fetch("http://localhost:8080/omics/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });
              handleClose();
              props.fetchOmics();
              if (response.status !== 200)
                alert((await response.json()).message);
            })}
          >
            <Grid container>
              <Table>
                <TableRow>
                  <TableCell>
                    <TextField
                      id="gene"
                      label="Gene"
                      placeholder="Gene"
                      variant="standard"
                      {...register("gene", { required: true })}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TextField
                      id="transcript"
                      label="transcript"
                      variant="standard"
                      placeholder="Enter transcripts"
                      helperText="Enter transcripts separated by commas"
                      {...register("transcript", { required: true })}
                    />
                  </TableCell>
                </TableRow>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <Button variant="outlined" type="submit">
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Grid>
          </form>
        </Box>
      </StyledModal>
    </div>
  );
}
