import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const ProductPage = React.lazy(() => import("../pages/private/Product"));
const PrivateRoutes = () => {
  return (
    <>
      <Suspense fallback={<div>.....loading</div>}>
        <Routes>
          <Route path="/product" element={<ProductPage />} />
          <Route path="*" element={<Navigate to="/product" />} />
        </Routes>
      </Suspense>
    </>
  );
};
export default PrivateRoutes;