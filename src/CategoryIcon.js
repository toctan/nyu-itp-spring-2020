import { Avatar, makeStyles } from "@material-ui/core";

import React from "react";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: "#f94878",
  },
}));

export default function CategoryIcon(props) {
  const classes = useStyles();

  const category = props.category || {};
  const icon = category.icon || {};
  return (
    <Avatar
      src={`${icon.prefix}100${icon.suffix}`}
      aria-label="category"
      className={classes.avatar}
    />
  );
}
