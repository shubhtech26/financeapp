import { useEffect } from 'react';
import { isLoggedIn } from '../utils/auth';

const useSession = () => {
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = '/';
    }
  }, []);
};

export default useSession;
