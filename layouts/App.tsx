import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LogIn from '@pages/Login';
import SignUp from '@pages/SignUp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
