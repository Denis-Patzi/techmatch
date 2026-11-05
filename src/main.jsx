import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/hero-universe.css';
import './styles/social-landing.css';
import App from './App.jsx';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>
);
