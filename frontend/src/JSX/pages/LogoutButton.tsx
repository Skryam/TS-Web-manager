import { useApolloClient } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getApi } from '../../api/client';
import { useFlash } from '../components/FlashProvider';

export default function LogoutButton() {
  const flash = useFlash();
  const { t } = useTranslation();
  const api = getApi();
  const client = useApolloClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      await client.resetStore();
      flash(t('flash.session.delete.success'));
      navigate('/');
    } catch (err) {
      flash(t('flash.session.delete.error'));
    }
  };

  return (
    <Button className="btn btn-danger nav-link link-danger" onClick={handleLogout}>
      {t('layouts.application.signOut')}
    </Button>
  );
}
