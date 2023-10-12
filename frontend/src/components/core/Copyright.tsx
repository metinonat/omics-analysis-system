import Typography from "@mui/material/Typography";

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      Metin Onat ÇUKUR {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
export default Copyright;
