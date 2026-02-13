import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Welcome from './welcome.tsx'

const App = (props) => {
  return (
    <body className='d-flex flex-column min-vh-100 bg-light'>
      <nav className='navbar navbar-expand-lg navbar-light mb-3 bg-secondary bg-opacity-25 container-fluid'>
        <a className='navbar-brand' href='/'>Рут</a>
        <button className='navbar-toggler' data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent">
          <span className='navbar-toggler-icon' />
        </button>
      </nav>
      <Welcome />
    </body>
  )
}


const mountNode = document.getElementById('root');
const root = ReactDOM.createRoot(mountNode);
root.render(<App />)