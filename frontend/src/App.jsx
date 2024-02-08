import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { getAuthToken } from "./constants/helpers";
import { useRecoilValue } from "recoil";
import { AuthTokenAtom } from "./atoms/atoms";

const SignUp = lazy(() => import("./components/SignUp"));
const SignIn = lazy(() => import("./components/SignIn"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Send = lazy(() => import("./components/Send"));

const App = () => {
  const authTokenAtom = useRecoilValue(AuthTokenAtom);
  useEffect(() => {}, [authTokenAtom]);
  return (
    <div>
      <Suspense fallback={<p>.........loading</p>}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<Send />} />

          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* {authTokenAtom !== null ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send" element={<Send />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
            </>
          )} */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
