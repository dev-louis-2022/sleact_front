import React, { useCallback } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  const {
    data: userData,
    error,
    mutate,
  } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
  });
  // swr은 context, redux처럼 전역 데이터 관리
  // dedupingInterval은 이 시간안에 요청은 캐시된 데이터를 사용
  const [email, , onChangeEmail] = useInput('');
  const [password, , onChangePassword] = useInput('');
  const [inputError, setInputError] = useInput('');
  const [logInError, setLoginError] = useInput(false);
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoginError(false);
      setInputError('');
      if (email && password) {
        axios
          .post(
            '/api/users/login',
            {
              email,
              password,
            },
            { withCredentials: true },
          )
          .then((response) => {
            // mutate는 서버에 요청 안하고 로컬 데이터 갱신
            // OPTIMISTIC UI:
            // mutate(data, true)면 로컬 데이터 갱신 후 서버 요청해서 데이터 갱신
            // mutate(data, false)는 서버 요청 안함
            mutate(response.data.data, false); // OPTIMISTIC UI
          })
          .catch((error) => {
            setLoginError(true);
          });
      } else {
        if (!email) setInputError('이메일 주소');
        else setInputError('비밀번호');
      }
    },
    [email, password],
  );

  if (userData === undefined) {
    return <div>로딩중................</div>;
  }

  if (userData) {
    return <Navigate to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {inputError && <Error>{inputError}를 입력해주세요.</Error>}
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
