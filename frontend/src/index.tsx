import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, useQuery } from '@apollo/client/react';
import client from './apollo/client.ts';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import Welcome from './components/welcome.tsx';
import UsersList from './components/UsersList.tsx';
import NewUser from './components/NewUser.tsx';
import Login from './components/Login.tsx';
import LogoutButton from './components/Logout.tsx';
import { GET_ME } from './graphql/queries.ts';

interface Medata {
  me: {
    id: string;
    email: string;
    firstName: string;
  } | null;
};

const App = () => {
  const { data } = useQuery<Medata>(GET_ME);
  const isAuthenticated = !!data?.me;
  console.log(isAuthenticated)

  return (
    <div className='d-flex flex-column min-vh-100 bg-light'>
      <nav className='navbar navbar-expand-lg navbar-light mb-3 bg-secondary bg-opacity-25 container-fluid'>
        <Link to="/" className='navbar-brand'>Рут</Link>

        <button
        className='navbar-toggler'
        data-bs-toggle="collapse"
        data-bs-target="#navbarToggleExternalContent"
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div className="collapse navbar-collapse" id="navbarToggleExternalContent">
          <ul className='navbar-nav me-auto'>
            <li className='nav-item'>
              <Link to="/users" className='navbar-brand'>Пользователи</Link>
            </li>
          </ul>

          <ul className='navbar-nav'>
            {isAuthenticated ? (
              <>
                <li className='nav-item'>
                  <li className='nav-item'>
                    <LogoutButton />
                  </li>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'><Link to='newUser' className='nav-link'>Регистрация</Link></li>
                <li className='nav-item'><Link to='login' className='nav-link'>Вход</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <div className='container flex-grow-1'>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/users' element={<UsersList />} />
          <Route path='/newUser' element={<NewUser />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}


const mountNode = document.getElementById('root')!;
const root = ReactDOM.createRoot(mountNode);
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);