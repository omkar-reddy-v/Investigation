import React from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './styles.css';

const theme = createTheme({
  palette: { primary: { main: '#1766a8' }, background: { default: '#f5f7fa' } },
  typography: { fontFamily: 'Arial, Helvetica, sans-serif' },
  shape: { borderRadius: 8 },
  components: { MuiTextField: { defaultProps: { size: 'small', fullWidth: true } } },
});
createRoot(document.getElementById('root')).render(
  <React.StrictMode><ThemeProvider theme={theme}><CssBaseline/><App/></ThemeProvider></React.StrictMode>
);
