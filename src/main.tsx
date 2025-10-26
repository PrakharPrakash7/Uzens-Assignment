import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-neutral-50 p-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">Kanban Board Component</h1>
      <p className="text-neutral-600 mb-4">
        Run <code className="bg-neutral-200 px-2 py-1 rounded">npm run storybook</code> to view the component documentation and interactive demos.
      </p>
    </div>
  </React.StrictMode>,
);
