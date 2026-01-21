import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const UserLogin = React.lazy(() => import("../pages/public/Login"));
const UserRegister = React.lazy(() => import("../pages/public/Register"));

const PublicRoutes = () => {
  return (
    <>
      <Suspense fallback={<div>.....loading</div>}>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default PublicRoutes;