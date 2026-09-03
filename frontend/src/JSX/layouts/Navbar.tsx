import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Navbar, Nav, Container, ButtonGroup, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { GET_ME } from "../../graphql/queries";
import LogoutButton from "../pages/LogoutButton";

export default function AppNavbar() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { data } = useQuery(GET_ME);
  const isAuthenticated = !!data?.me;

  return (
    <Navbar expand="lg" className="mb-3 bg-secondary bg-opacity-25">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">{t('appName')}</Navbar.Brand>

        <ButtonGroup size="sm">
          <Button 
            variant={i18n.language === 'ru' ? 'primary' : 'outline-primary'}
            onClick={() => i18n.changeLanguage('ru')}
          >
            RU
          </Button>
          <Button 
            variant={i18n.language === 'en' ? 'primary' : 'outline-primary'}
            onClick={() => i18n.changeLanguage('en')}
          >
            EN
          </Button>
        </ButtonGroup>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/users">{t('layouts.application.users')}</Nav.Link>
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/statuses">{t('layouts.application.statuses')}</Nav.Link>
                <Nav.Link as={Link} to="/labels">{t('layouts.application.labels')}</Nav.Link>
                <Nav.Link as={Link} to="/tasks">{t('layouts.application.tasks')}</Nav.Link>

                <Nav.Item className="ms-5">
                  <LogoutButton />
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/newUser">{t('layouts.application.signUp')}</Nav.Link>
                <Nav.Link as={Link} to="/login">{t('layouts.application.signIn')}</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}