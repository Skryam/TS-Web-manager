import { useParams } from "react-router-dom";

export const useIdParams = () => {
  const { id } = useParams();
  console.log(id)
  return id ? Number(id) ? id : null : undefined
}