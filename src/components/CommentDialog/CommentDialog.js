import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import './comment-dialog.scss';

export default function CommentDialog(props) {
  return (
    <div>
      <Dialog open={props.open} onClose={props.handleCloseModal}>
        <DialogTitle>Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.track && (
              <div class='dialog__content'>
                <img
                  src={props.track.cover_image_path}
                  alt={props.track.name}
                />
                &nbsp;
                <span>
                  What would you like to say about "
                  {props.track.name || 'unknown song'}" from&nbsp;
                  {props.track.artist_name || 'unknown artist'} ?
                </span>
              </div>
            )}
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rowsMax='5'
            rows='2'
            type='text'
            fullWidth
            onChange={props.handleUserInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCloseModal} color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={() => props.commentTrack(props.track.id)}
            color='primary'
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
