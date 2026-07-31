import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Navbar, Nav, Container } from "react-bootstrap"; // Импортируем компоненты

import { GET_ME } from "../../graphql/queries";
import LogoutButton from "../pages/LogoutButton";

export default function AppNavbar() {
  const { data } = useQuery(GET_ME);
  const isAuthenticated = !!data?.me;

  return (
    <Navbar expand="lg" className="mb-3 bg-secondary bg-opacity-25">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Рут</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/users">Пользователи</Nav.Link>
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/statuses">Статусы</Nav.Link>
                <Nav.Link as={Link} to="/labels">Лейблы</Nav.Link>
                <Nav.Link as={Link} to="/tasks">Задачи</Nav.Link>

                <Nav.Item className="ms-5">
                  <LogoutButton />
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/newUser">Регистрация</Nav.Link>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}