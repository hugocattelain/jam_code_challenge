import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import Player from './components/Player/Player';
import 'typeface-roboto';
import './App.scss';

const muiBlack = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#616161',
    },
  },
  overrides: {
    MuiSlider: {
      root: {
        color: '#fff',
        margin: '0 10px',
      },
    },
    MuiButton: {
      root: {
        minWidth: '24px',
      },
    },
    MuiTableCell: {
      root: {
        whiteSpace: 'nowrap',
        padding: '14px 0px 14px 16px',
      },
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={muiBlack}>
      <div className='App'>
        <Player />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
