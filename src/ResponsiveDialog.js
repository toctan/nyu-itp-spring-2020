import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, Done } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(7),
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResponsiveDialog({
  title,
  content,
  handleSubmit,
  closeURL,
  ...rest
}) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const history = useHistory();
  const location = useLocation();
  const handleClose = () => {
    const background = location.state && location.state.background;
    history.push(background || closeURL);
  };

  return (
    <Dialog
      open={true}
      fullScreen={fullScreen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      TransitionComponent={Transition}
      {...rest}
    >
      <form onSubmit={handleSubmit}>
        {fullScreen ? (
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <Close />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {title}
              </Typography>
              <IconButton
                edge="end"
                type="submit"
                color="inherit"
                aria-label="submit"
              >
                <Done />
              </IconButton>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        )}
        <DialogContent className={classes.content}>{content}</DialogContent>
        {fullScreen || (
          <DialogActions>
            <Button color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}
