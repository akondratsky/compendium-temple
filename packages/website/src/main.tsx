import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'antd';
import { HomePage } from './pages/home';

ReactDOM
  .createRoot(
    document.getElementById('root') as HTMLElement
  )
  .render(
    <StrictMode>
      <BrowserRouter>
        <App>
          <HomePage />
        </App>
      </BrowserRouter>
    </StrictMode>
  );
