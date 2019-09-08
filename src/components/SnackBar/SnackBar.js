import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import './snackbar.scss';

export default function SnackBar(props) {
  const { message, notificationStatus, open, handleCloseSnackBar } = props;
  const Icon = notificationStatus === 'success' ? CheckCircleIcon : ErrorIcon;

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackBar}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={
          <div className='snack-bar__content'>
            <Icon className='snack-bar__icon' />
            {message}
          </div>
        }
        action={[
          <IconButton
            key='close'
            aria-label='close'
            color='inherit'
            onClick={handleCloseSnackBar}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
}
