import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure browser starts at the top on reload/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(<App />);
