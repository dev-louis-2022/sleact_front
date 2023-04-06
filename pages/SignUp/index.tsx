import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';

const SignUp = () => {
  const {
    data: userData,
    error,
    mutate,
  } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
  });
  const [email, , onChangeEmail] = useInput('');
  const [nickname, , onChangeNickname] = useInput('');
  const [password, setPassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useInput(false);
  const [signUpError, setSignUpError] = useInput('');
  const [signUpSuccess, setSignUpSuccess] = useInput(false);
  const [inputError, setInputError] = useInput('');

  // const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.target.value);
  // }, []);

  // const onChangeNickname = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNickname(e.target.value);
  // }, []);

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
      setInputError('');
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
      setInputError('');
    },
    [password],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck, mismatchError);
      setSignUpError('');
      setSignUpSuccess(false);
      setInputError('');
      if (email && nickname && password && passwordCheck && !mismatchError) {
        axios
          .post(
            '/api/users',
            {
              email,
              nickname,
              password,
            },
            { withCredentials: true },
          )
          .then((response) => {
            setSignUpSuccess(true);
            mutate(response.data.data, false);
          })
          .catch((error) => {
            setSignUpError(error.response.data.data);
          });
      } else {
        if (!email) setInputError('이메일 주소를');
        else if (!nickname) setInputError('닉네임을');
        else if (!password) setInputError('비밀번호를');
        else setInputError('비밀번호 확인란을');
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {inputError && <Error>{inputError} 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
