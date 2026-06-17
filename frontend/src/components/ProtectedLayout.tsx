import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet } from "react-router-dom";
import { GET_ME } from "../graphql/queries";

interface Medata {
  me: {
    id: string;
    email: string;
    firstName: string;
  } | null;
};

export default function ProtectedLayout() {
  const { data, loading } = useQuery<Medata>(GET_ME);

  if (loading) return <div>Загрузка...</div>;
  if (!data?.me) return <Navigate to="/login" replace />;

  return <Outlet />;
}