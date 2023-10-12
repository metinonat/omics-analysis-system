import { Biotech, Science } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ListItem } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import * as React from "react";
export const listItems = (
  <React.Fragment>
    <ListItem disablePadding>
      <Link href={"/"} passHref>
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </Link>
    </ListItem>
    <ListItem disablePadding>
      <Link href={"/samples"} passHref>
        <ListItemButton>
          <ListItemIcon>
            <Science />
          </ListItemIcon>
          <ListItemText primary="Samples" />
        </ListItemButton>
      </Link>
    </ListItem>
    <ListItem disablePadding>
      <Link href={"/omics"} passHref>
        <ListItemButton>
          <ListItemIcon>
            <Biotech />
          </ListItemIcon>
          <ListItemText primary="Omics" />
        </ListItemButton>
      </Link>
    </ListItem>
    <ListItem disablePadding>
      <Link href={"/analysis"} passHref>
        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Analysis" />
        </ListItemButton>
      </Link>
    </ListItem>
  </React.Fragment>
);
export default listItems;
