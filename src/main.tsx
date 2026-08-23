import './i18n';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.querySelector('#app')!).render(<App />);
