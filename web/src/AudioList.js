import qs from 'qs';
import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, Box, IconButton, Container, Grid, Typography} from '@material-ui/core';
import {Card, CardHeader, CardActions} from '@material-ui/core';
import { PlayArrow, Delete } from '@material-ui/icons';
import { withStyles } from "@material-ui/core/styles";
import {UserContext} from './User';
import foursquare from './APIClient';

const styles = theme => ({
  offset: theme.mixins.toolbar,
  avatar: {
    backgroundColor: "#f94878",
  },
  title: {
    fontSize: 14,
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
    foursquare.get('demo/marsbot/audio/snippetuser', {
      params: {
        userId: user.id,
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
    const category = venue.categories[0].icon;
    return (
      <Grid item key={audio.id} xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar
                src={`${category.prefix}100${category.suffix}`}
                aria-label="recipe" className={classes.avatar} />
            }
            disableTypography={true}
            title={
              <Typography variant="h5" component="h2" noWrap>
                {venue.name}
              </Typography>
            }
            subheader={
              <Typography variant="subtitle1" color="textSecondary" noWrap>
                {venue.location.formattedAddress[0]}
              </Typography>}
          />

          <CardActions>
            <IconButton aria-label="play">
              <PlayArrow />
              <Box component="span" fontSize="body1.fontSize">
                {audio.playCount}
              </Box>
            </IconButton>

            <IconButton
              onClick={() => this.handleDelete(index)}
              aria-label="delete">
              <Delete />
            </IconButton>

            <Typography variant="caption" color="textSecondary" noWrap>
              {audio.createDate}
            </Typography>
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
        <div className={classes.offset} />
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
