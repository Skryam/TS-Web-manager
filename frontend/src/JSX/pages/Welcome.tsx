import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { GET_ME } from '../../graphql/queries';

export default () => {
  const { t } = useTranslation();
  const { data } = useQuery(GET_ME);
  const isAuthenticated = !!data?.me;

  return (
    <div className="bg-light" style={{ minHeight: 'calc(100vh - 76px)' }}>
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold">{t('views.welcome.index.hello')}</h1>
          <p className="lead text-muted mx-auto mt-3" style={{ maxWidth: '640px' }}>
            {t('views.welcome.index.description')}
          </p>

          <div className="d-flex gap-3 justify-content-center mt-4">
            {isAuthenticated ? (
              <Link to="/tasks" className="btn btn-primary btn-lg px-4">
                {t('layouts.application.tasks')} →
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg px-4">
                  {t('layouts.application.signIn')} →
                </Link>
                <Link to="/newUser" className="btn btn-outline-primary btn-lg px-4">
                  {t('layouts.application.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>

        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center">
              <Card.Body>
                <div className="fs-1 mb-2">📋</div>
                <Card.Title>{t('views.welcome.index.features.tasks')}</Card.Title>
                <Card.Text className="text-muted">
                  {t('views.welcome.index.features.tasksText')}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center">
              <Card.Body>
                <div className="fs-1 mb-2">🏷️</div>
                <Card.Title>{t('views.welcome.index.features.labels')}</Card.Title>
                <Card.Text className="text-muted">
                  {t('views.welcome.index.features.labelsText')}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center">
              <Card.Body>
                <div className="fs-1 mb-2">⚙️</div>
                <Card.Title>{t('views.welcome.index.features.statuses')}</Card.Title>
                <Card.Text className="text-muted">
                  {t('views.welcome.index.features.statusesText')}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
