import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../graphql/queries";
import LogoutButton from "./Logout";

interface Medata {
  me: {
    id: string;
    email: string;
    firstName: string;
  } | null;
};

export default function Navbar () {

  const { data } = useQuery<Medata>(GET_ME);
  const isAuthenticated = !!data?.me;

  return (
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
              <li className='nav-item'><Link to='/statuses' className='nav-link'>Статусы</Link></li>
              <li className='nav-item'>Лейблы</li>
              <li className='nav-item'>Задачи</li>
              <li className='nav-item'>
                <LogoutButton />
              </li>
            </>
          ) : (
            <>
              <li className='nav-item'><Link to='/newUser' className='nav-link'>Регистрация</Link></li>
              <li className='nav-item'><Link to='/login' className='nav-link'>Вход</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}