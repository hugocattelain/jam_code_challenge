import React from 'react';
import axios from 'axios';
// Child components
import TimeBar from '../TimeBar/TimeBar';
import SnackBar from '../SnackBar/SnackBar';
import CommentDialog from '../CommentDialog/CommentDialog';
// Material-ui components
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
// Icons
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';
// Styles
import './player.scss';

const tracksUrl = 'https://api-stg.jam-community.com/song/trending';
const likeUrl =
  'https://api-stg.jam-community.com/interact/like?apikey=agAFTxkmMIWsmN9zOpM_6l2SkZPPy21LGRlxhYD8';
const commentUrl =
  'https://api-stg.jam-community.com/interact/comment?apikey=agAFTxkmMIWsmN9zOpM_6l2SkZPPy21LGRlxhYD8';

class Player extends React.Component {
  state = {
    trackList: [],
    selectedTrack: null,
    player: 'paused',
    isLoading: true,
    volume: 100,
    message: '',
    notificationStatus: '',
    snackBarOpen: false,
    commentDialogOpen: false,
    comment: '',
    trackToComment: null,
  };

  componentDidMount = () => {
    axios
      .get(tracksUrl)
      .then(res => {
        const tracks = res.data;
        this.setState({
          trackList: tracks.map(obj => ({
            ...obj,
            liked: false,
          })),
          isLoading: false,
          selectedTrack: this.state.trackList[0],
        });
        this.player.src = this.state.trackList[0].music_file_path;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          message: 'An error occured while getting the songs.',
          notificationStatus: 'error',
          snackBarOpen: true,
        });
      });

    this.player.addEventListener('timeupdate', e => {
      this.setState({
        currentTime: e.target.currentTime,
        duration: e.target.duration,
      });
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.currentTime &&
      this.state.duration &&
      this.state.currentTime === this.state.duration &&
      this.state.player === 'playing'
    ) {
      this.handleSkip('next');
    }
    if (
      this.state.selectedTrack !== prevState.selectedTrack &&
      prevState.selectedTrack !== null
    ) {
      let track = this.state.selectedTrack.music_file_path;
      if (track) {
        this.player.src = track;
        this.player.play();
        this.setState({ player: 'playing' });
      }
    }

    if (this.state.player !== prevState.player) {
      if (this.state.player === 'paused') {
        this.player.pause();
      } else if (
        this.state.player === 'playing' &&
        prevState.player === 'paused'
      ) {
        this.player.play();
      }
    }
  };

  componentWillUnmount = () => {
    this.player.removeEventListener('timeupdate', () => {});
  };

  getTime = time => {
    if (!isNaN(time)) {
      return (
        Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
      );
    }
  };

  handleSkip = direction => {
    const trackList = this.state.trackList;
    const currentTrackIndex = trackList.findIndex(
      track => track.name === this.state.selectedTrack.name
    );
    const tracksAmount = trackList.length - 1;
    if (direction === 'previous') {
      const previousTrack =
        currentTrackIndex === 0 ? tracksAmount : currentTrackIndex - 1;
      const trackToPlay = trackList[previousTrack];
      this.setState({ selectedTrack: trackToPlay });
    } else if (direction === 'next') {
      const nextTrack =
        currentTrackIndex === tracksAmount ? 0 : currentTrackIndex + 1;
      const trackToPlay = trackList[nextTrack];
      this.setState({ selectedTrack: trackToPlay, duration: null });
    }
  };

  setTime = (event, time) => {
    this.player.currentTime = (time * this.state.duration) / 100;
  };

  handleVolumeChange = (event, newValue) => {
    const volume = newValue <= 100 && newValue >= 0 ? newValue : 50;
    this.setState({ volume: volume });
    this.player.volume = volume / 100;
  };

  toggleMute = () => {
    const volume = this.state.volume > 0 ? 0 : 50;
    this.setState({ volume: volume });
    this.player.volume = volume / 100;
  };

  likeTrack = (trackId, index) => event => {
    event.stopPropagation();
    const likeInit = {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, // prettier-ignore
      mode: 'no-cors',
      body: JSON.stringify({ id: trackId, type: 'song' }),
    };
    fetch(likeUrl, likeInit)
      .then(res => {
        const newTrackList = [...this.state.trackList];
        newTrackList[index].liked = !this.state.trackList[index].liked;
        this.setState(prevState => ({
          trackList: newTrackList,
        }));
      })
      .catch(error => {
        this.setState({
          message: 'An error occured. This song could not be liked',
          notificationStatus: 'error',
          snackBarOpen: true,
        });
      });
  };

  openTrackComment = track => event => {
    event.stopPropagation();
    this.setState({ commentDialogOpen: true, trackToComment: track });
  };

  commentTrack = trackId => {
    if (this.state.comment === '') {
      return;
    }
    const commentInit = {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, // prettier-ignore
      body: JSON.stringify({
        id: trackId,
        type: 'song',
        message: this.state.comment,
      }),
      mode: 'no-cors',
    };
    fetch(commentUrl, commentInit)
      .then(response => {
        this.setState({
          message: 'Your comment "' + this.state.comment + '" was posted.',
          notificationStatus: 'success',
          commentDialogOpen: false,
          snackBarOpen: true,
          comment: '',
          trackToComment: {},
        });
      })
      .catch(error => {
        this.setState({
          message: 'An error occured. Your message was not posted.',
          notificationStatus: 'error',
          commentDialogOpen: false,
          snackBarOpen: true,
          comment: '',
          trackToComment: {},
        });
      });
  };

  handleUserInput = event => {
    this.setState({ comment: event.target.value });
  };

  handleCloseModal = () => {
    this.setState({ commentDialogOpen: false, trackToComment: {} });
  };

  handleCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  };

  render() {
    const {
      trackList,
      isLoading,
      selectedTrack,
      currentTime,
      duration,
      volume,
      message,
      notificationStatus,
      commentDialogOpen,
      snackBarOpen,
      trackToComment,
    } = this.state;
    const formatedCurrentTime = this.getTime(this.state.currentTime);
    const formatedDuration = this.getTime(this.state.duration);

    return (
      <div>
        <h1>Music Player</h1>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className='track-list__container'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='left'></TableCell>
                  <TableCell align='left'>Artist</TableCell>
                  <TableCell align='left'>Title</TableCell>
                  <TableCell align='left'>Plays</TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trackList.map((track, index) => (
                  <TableRow
                    key={track.name}
                    className='track-list__row'
                    onClick={() => this.setState({ selectedTrack: track })}
                  >
                    <TableCell align='left'>
                      <img src={track.cover_image_path} alt={track.name} />
                      <PlayCircleOutlineIcon
                        className={'track-list__cover-play-icon'}
                      />
                    </TableCell>
                    <TableCell align='left'>{track.artist_name}</TableCell>
                    <TableCell align='left'>{track.name}</TableCell>
                    <TableCell align='left'>
                      <PlayArrowIcon className='track-list__play-icon' />
                      {track.plays}
                    </TableCell>
                    <TableCell align='right'>
                      <Button
                        className='track-list__action-button'
                        size='small'
                        onClick={this.likeTrack(track.id, index)}
                      >
                        {track.liked ? (
                          <FavoriteIcon className='track-list__action-icon' />
                        ) : (
                          <FavoriteBorderIcon className='track-list__action-icon' />
                        )}
                      </Button>
                      <Button
                        className='track-list__action-button'
                        size='small'
                        onClick={this.openTrackComment(track)}
                      >
                        <ChatBubbleOutlineIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <audio ref={ref => (this.player = ref)} />

        <div className='app-bar'>
          <SkipPreviousIcon
            onClick={() => this.handleSkip('previous')}
            className='app-bar__prev-icon'
          />
          {this.state.player === 'paused' && (
            <PlayArrowIcon
              onClick={() => this.setState({ player: 'playing' })}
              className='app-bar__play-icon'
            />
          )}
          {this.state.player === 'playing' && (
            <PauseIcon
              onClick={() => this.setState({ player: 'paused' })}
              className='app-bar__pause-icon'
            />
          )}
          <SkipNextIcon
            onClick={() => this.handleSkip('next')}
            className='app-bar__next-icon'
          />

          {formatedCurrentTime || '0:00'}
          <TimeBar
            setTime={this.setTime}
            currentTime={currentTime}
            duration={duration}
          />
          {formatedDuration || '0:00'}
          <div className='app-bar__volume-container'>
            <div className='app-bar__volume-icon' onClick={this.toggleMute}>
              {volume === 0 && <VolumeOff />}
              {volume <= 50 && volume > 0 && <VolumeDown />}
              {volume > 50 && <VolumeUp />}
            </div>
            <div className='app-bar__volume-slider'>
              <Slider
                orientation='vertical'
                value={volume}
                onChange={this.handleVolumeChange}
              />
            </div>
          </div>
          {selectedTrack && (
            <p className='app-bar__track-info'>
              <img
                src={selectedTrack.cover_image_path}
                alt={selectedTrack.name}
              />
              &nbsp; {selectedTrack.artist_name} - {selectedTrack.name}
            </p>
          )}
        </div>

        <CommentDialog
          open={commentDialogOpen}
          handleCloseModal={this.handleCloseModal}
          handleUserInput={this.handleUserInput}
          commentTrack={this.commentTrack}
          track={trackToComment}
        />
        <SnackBar
          message={message}
          notificationStatus={notificationStatus}
          open={snackBarOpen}
          handleCloseSnackBar={this.handleCloseSnackBar}
        />
      </div>
    );
  }
}

export default Player;
