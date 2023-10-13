import { TextField } from "@mui/material";
import React from "react";
import { useEffect } from "react";

interface SearchBarProps {
  label: string;
  search: (filter: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
  const [value, setValue] = React.useState<string>("");
  const { search, label } = props;

  useEffect(() => {
    search(value);
  },[value]);

  return (
    <TextField
      id="search_bar"
      label={label}
      variant="standard"
      fullWidth
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
