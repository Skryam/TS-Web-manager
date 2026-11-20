import { useParams } from 'react-router-dom';

export const useIdParams = () => {
  const { id } = useParams();

  if (!id || Number.isNaN(Number(id))) {
    return null;
  }
  return id;
};