"use client";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

interface CreateButtonProps {
  label: string;
}

export default function CreateButton(props: CreateButtonProps) {
  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={() => console.log("clicked")}
    >
      {props.label}
    </Button>
  );
}
