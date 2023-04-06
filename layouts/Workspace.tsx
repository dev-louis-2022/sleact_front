import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';

interface Props {
  children: React.ReactNode;
}

const Workspace: FC<Props> = ({ children }) => {
  const {
    data: userData,
    error,
    mutate,
  } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
  });

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, { withCredentials: true })
      .then((response) => {
        mutate(false, false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
