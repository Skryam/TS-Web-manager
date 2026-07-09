import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet } from "react-router-dom";

import { GET_ME } from "../../graphql/queries";

export default function ProtectedLayout() {
  const { data, loading } = useQuery(GET_ME);

  if (loading) {
    return <div>Загрузка...</div>;
  }
  if (!data?.me) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}