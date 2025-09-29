import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { socketClient } from '../../utils/socketClient';

export const useSocket = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const socketRef = useRef(socketClient);

  useEffect(() => {
    if (user && token) {
      socketRef.current.connect(token);
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, token]);

  return socketRef.current;
};