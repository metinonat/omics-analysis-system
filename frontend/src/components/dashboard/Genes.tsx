import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";

import * as React from "react";
import Title from "../common/Title";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveList() {
  const [dense] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <React.Fragment>
        <Title>Genes</Title>
        <Demo>
          <List dense={dense}>
            <ListItem>
              <ListItemText primary="Gene1" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Gene2" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Gene3" />
            </ListItem>
          </List>
        </Demo>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Link color="secondary" href={"/omics"} component="a">
            More <ArrowForwardIosIcon fontSize="small" />
          </Link>
        </div>
      </React.Fragment>
    </Box>
  );
}
