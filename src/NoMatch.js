import { Paper, Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: `calc(100vh - ${theme.spacing(8)}px)`,
    paddingTop: "20%",
    textAlign: "center",
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" color="error">
        404 - Page Not Found
      </Typography>
    </Paper>
  );
};
