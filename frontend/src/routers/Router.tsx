import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router';
import Home from '../views/Home';
import Login from '../views/Login';

const ProtectedRoute = ({ isAuth }: { isAuth: boolean }) => {
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/login'} element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
