"use client";

import { AllAnomaliesTable, ExpressionChart } from "@/components";
import { Box, Container, Tab, Tabs, Toolbar } from "@mui/material";

import * as React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, position: "relative" }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AnalysisPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Toolbar />
      <Container sx={{ width: "100%" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, width: "100%", borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="fullWidth"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
              }}
            >
              <Tab label="All Anomalies" {...a11yProps(0)} />
              <Tab label="Genes Expression" {...a11yProps(1)} />
              <Tab label="Expression Heatmap" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <AllAnomaliesTable />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ExpressionChart />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
        </Box>
      </Container>
    </>
  );
}
