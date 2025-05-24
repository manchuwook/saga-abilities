import { FC } from 'react';
import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';

const AppWrapper: FC = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

export default AppWrapper;
