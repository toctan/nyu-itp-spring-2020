import { Box, IconButton, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  listActionIcon: {
    marginRight: theme.spacing(1),
    "&:last-child": {
      marginRight: 0,
    },
  },
}));

export default function ListActionItem(props) {
  const { text, edge, rootProps } = props;
  const classes = useStyles();
  return (
    <IconButton
      edge={edge}
      size="small"
      className={classes.listActionIcon}
      {...rootProps}
    >
      <props.icon fontSize="small" />
      <Box component="span" fontSize="body2.fontSize" ml={0.5}>
        {text}
      </Box>
    </IconButton>
  );
}
