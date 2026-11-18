import { useParams } from "react-router-dom";

export const useIdParams = () => {
  const { id } = useParams();
  if (Number(id)) {
    return id;
  }
  return null;
}