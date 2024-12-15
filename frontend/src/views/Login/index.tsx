import React, { useState } from 'react';
import { login } from '../../apis/auth';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    id: '',
    password: '',
  });

  const handleInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const { data } = await login(info);
      if (data.success) {
        navigate('/');
      }
    } catch (e) {
      console.error('로그인 에러', e);
    }
  };

  return (
    <>
      <input placeholder="id" name="id" value={info.id} onChange={handleInfo} />
      <input
        placeholder="password"
        name="password"
        value={info.password}
        onChange={handleInfo}
      />
      <button onClick={handleLogin}>로그인</button>
    </>
  );
};

export default Login;
