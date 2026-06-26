import { useApolloClient } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/client";

export default function LogoutButton() {
  const client = useApolloClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      await client.resetStore();
      navigate('/');
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <button className="btn btn-link nav-link" onClick={handleLogout}>Выйти</button>
  )
}