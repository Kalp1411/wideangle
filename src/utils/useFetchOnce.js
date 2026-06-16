import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useFetchOnce = (data, fetchAction) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      dispatch(fetchAction());
    }
  }, [dispatch, data, fetchAction]);
};

export default useFetchOnce;