import { TextField } from "@mui/material";
import React from "react";
import { useEffect } from "react";

interface SearchBarProps {
  search: (filter: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
  const [value, setValue] = React.useState<string>("");
  const { search } = props;

  useEffect(() => {
    search(value);
  },[value, search]);

  return (
    <TextField
      id="search_samples"
      label="Search Samples"
      variant="standard"
      fullWidth
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
