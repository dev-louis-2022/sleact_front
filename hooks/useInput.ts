import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnType<T> = [T, Dispatch<SetStateAction<T>>, (e: any) => void];

const useInput = <T>(initialData: T): ReturnType<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);

  return [value, setValue, handler];
};

export default useInput;
