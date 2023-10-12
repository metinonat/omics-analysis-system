import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

interface Film {
  name: string;
  gene: string;
  value: number;
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Film[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      filterOptions={(x) => x}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { name: 'sample1', gene: "gene1", value: 0.30 },
  { name: 'sample2', gene: "gene2", value: 0.40 },
  { name: 'sample3', gene: "gene3", value: 0.50 },
  { name: 'sample4', gene: "gene4", value: 0.60 },
  { name: 'sample5', gene: "gene5", value: 0.70 },
  { name: 'sample6', gene: "gene6", value: 0.80 },
  { name: 'sample7', gene: "gene7", value: 0.90 },
  { name: 'sample8', gene: "gene8", value: 0.10 },
  { name: 'sample9', gene: "gene9", value: 0.20 },
  { name: 'sample10', gene: "gene10", value: 0.30 },
  { name: 'sample11', gene: "gene11", value: 0.40 },
  { name: 'sample12', gene: "gene12", value: 0.50 },
  { name: 'sample13', gene: "gene13", value: 0.60 },
  { name: 'sample14', gene: "gene14", value: 0.70 },
  { name: 'sample15', gene: "gene15", value: 0.80 },
  { name: 'sample16', gene: "gene16", value: 0.90 },
  { name: 'sample17', gene: "gene17", value: 0.10 },
  { name: 'sample18', gene: "gene18", value: 0.20 },
  { name: 'sample19', gene: "gene19", value: 0.30 },
  { name: 'sample20', gene: "gene20", value: 0.40 },
  { name: 'sample21', gene: "gene21", value: 0.50 },
  { name: 'sample22', gene: "gene22", value: 0.60 },
  { name: 'sample23', gene: "gene23", value: 0.70 },
  { name: 'sample24', gene: "gene24", value: 0.80 },
];