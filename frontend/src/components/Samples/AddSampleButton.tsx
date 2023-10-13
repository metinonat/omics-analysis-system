"use client";
import { Modal } from "@mui/base/Modal";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Grid,
  MenuItem,
  Table,
  TableCell,
  TableFooter,
  TableRow,
  TextField,
} from "@mui/material";
import { Box, Theme, styled } from "@mui/system";
import clsx from "clsx";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
  name: string;
  value: number;
  gene: string;
};

interface CreateButtonProps {
  label: string;
  fetchSamples: () => void;
}

export default function AddSampleButton(props: CreateButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [genes, setGenes] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const fecthGenesForSelect = (filter?: string) => {
    const url = filter
      ? `${process.env.API_URL}/omics/list/input?filter=${filter}`
      : `${process.env.API_URL}/omics/list/input`;
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setGenes(result);
      })
      .catch((error) => {
        console.error(error);
        error = true;
        setTimeout(() => {
          error = false;
        }, 5000);
      });
  };

  React.useEffect(() => {
    fecthGenesForSelect();
  }, []);
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
          <Title> Add A Sample </Title>
          <form
            onSubmit={handleSubmit(async (data) => {
              const reqBody = {
                geneId: data.gene,
                name: data.name,
                value: data.value,
              };
              const response = await fetch(`${process.env.API_URL}/samples/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
              });
              handleClose();
              props.fetchSamples();
              if (response.status !== 200)
                alert((await response.json()).message);
            })}
          >
            <Grid container>
              <Table>
                <TableRow>
                  <TableCell>
                    <TextField
                      id="name"
                      label="Name"
                      placeholder="Sample Name"
                      variant="standard"
                      {...register("name", { required: true })}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      id="value"
                      label="Value"
                      variant="standard"
                      placeholder="0.00"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*.[0-9]*",
                      }}
                      {...register("value", { required: true })}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <TextField
                      select
                      fullWidth
                      label="Gene"
                      {...register("gene", {
                        required: true,
                        onChange: (event) => {
                          fecthGenesForSelect(event.target.gene);
                        },
                      })}
                    >
                      {genes.map((gene: Gene) => (
                        <MenuItem key={gene._id} value={gene._id}>
                          {gene.gene}
                        </MenuItem>
                      ))}
                      {genes.length == 0 && (
                        <MenuItem key="empty-warning" disabled>
                          No gene found. Add a gene first.
                        </MenuItem>
                      )}
                    </TextField>
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
