import { rateLimitedApiRequest } from "@/api/request";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Title from "../common/Title";
let lastRequestTime: number = Date.now() - 1000 * 60;

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveList() {
  const [dense] = React.useState(false);
  const [data, setData] = useState([]);
  const [emptyItemCount, setEmptyItemCount] = useState<number>(0);
  const emptyItems = ["empty1", "empty2", "empty3"];

  useEffect(() => {
    rateLimitedApiRequest(lastRequestTime, () => {
      //@todo cannot get .env @see https://stackoverflow.com/questions/76280634/nextjs-app-not-read-environment-variables-from-docker-compose-yml
      axios
        .get(`http://localhost:8080/omics/list`)
        .then((res) => {
          setEmptyItemCount(
            3 - res.data.data.length > 0 ? 3 - res.data.data.length : 0
          );
          setData(res.data.data.splice(0, 3));
        })
        .catch((error) => console.error(error));
    });
  }, []);
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <React.Fragment>
        <Title>Genes</Title>
        <Demo>
          <List dense={dense}>
            {data.map((item: Gene) => (
              <ListItem key={item._id}>
                <ListItemText primary={item.gene} />
              </ListItem>
            ))}
            {emptyItems.map((item: string) => (
              <ListItem key={item}>
                <ListItemText
                  primary={
                    emptyItemCount == 3 && item === emptyItems[1]
                      ? "No genes to show."
                      : ""
                  }
                />
              </ListItem>
            ))}
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
