import { Typography, IconButton, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(1),
    "&:last-child": {
      marginRight: 0,
    },
    "&:disabled": {
      color: theme.palette.text.secondary,
      pointerEvents: "auto",
    },
  },
  text: {
    marginLeft: theme.spacing(0.5),
  },
}));

export default function ListActionItem(props) {
  const { text, icon, ...rest } = props;
  const classes = useStyles();
  return (
    <IconButton
      disabled={!(props.onClick || props.href || props.to)}
      size="small"
      classes={{
        root: classes.root,
        label: classes.label,
      }}
      {...rest}
    >
      <props.icon fontSize="small" />
      <Typography component="span" variant="body2" className={classes.text}>
        {text}
      </Typography>
    </IconButton>
  );
}
