import qs from 'qs';
import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, Box, IconButton, Container, Grid, Typography} from '@material-ui/core';
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { withStyles } from "@material-ui/core/styles";
import {UserContext} from './User';
import foursquare from './APIClient';

const styles = theme => ({
  avatar: {
    backgroundColor: "#f94878",
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 0,
    '& > audio': {
      maxWidth: "100%"
    }
  },
});


class AudioList extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      audios: [],
    };
  }

  componentDidMount() {
    const user = this.context;
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user_id') || user.id;
    foursquare.get('demo/marsbot/audio/snippetuser', {
      params: {
        userId: userId,
      }
    }).then(resp => this.setState({
      audios: resp.data.response.audio
    }));
  }

  handleDelete(index) {
    const audio = this.state.audios[index];
    const audios = this.state.audios.slice();
    audios.splice(index, 1);

    foursquare.post('demo/marsbot/audio/delete', qs.stringify({
      audioFileId: audio.id,
    })).then(resp => this.setState({audios: audios}))
      .catch(error => console.log(error));
  }

  renderAudio = (audio, index) => {
    const { classes } = this.props;
    const venue = audio.venues[0];
    let title = 'Jingle',  categoryIcon;
    if (audio.isName) title = 'Name';
    if (venue) {
      title = venue.name;
      const category = venue.categories && venue.categories[0];
      if (category) {
        const icon = category.icon;
        categoryIcon = `${icon.prefix}100${icon.suffix}`;
      }
    }

    return (
      <Grid item key={audio.id} xs={12} sm={6} md={4}>
        <Card>
          <CardHeader
            avatar={
              <Avatar
                src={categoryIcon}
                aria-label="recipe" className={classes.avatar} />
            }
            disableTypography={true}
            title={
              <Typography variant="h6" component="h2" noWrap className={classes.title} >
                {title}
              </Typography>
            }
            subheader={
              <Typography variant="subtitle1" color="textSecondary" noWrap>
                {venue && venue.location.formattedAddress[0]}
              </Typography>}
          />

          <CardContent className={classes.cardContent}>
            <audio controls src={audio.url}></audio>
          </CardContent>

          <CardActions>
            <Box component="span" flexGrow={1} ml={1} color="textSecondary" fontSize="caption.fontSize">
              Played {audio.playCountLastDay || 0} times yesterday, {audio.playCount || 0} times since {audio.createDate}
            </Box>

            <IconButton
              onClick={() => this.handleDelete(index)}
              aria-label="delete">
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const { audios } = this.state;
    const user = this.context;

    return (
      <main>
        <Box p={8} mb={4} bgcolor="background.paper">
          <Container component="main" maxWidth="sm">
            <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              {`${user.name.split(" ")[0]}'s Marsbot Audios`}
            </Typography>
          </Container>
        </Box>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {audios.map(this.renderAudio)}
          </Grid>
        </Container>
      </main>
    );
  };
}

AudioList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AudioList);
