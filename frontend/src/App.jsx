import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const SignUp = lazy(() => import("./components/SignUp"));
const SignIn = lazy(() => import("./components/SignIn"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Send = lazy(() => import("./components/Send"));

const App = () => {
  return (
    <div>
      <Suspense fallback={<p>.........loading</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<Send />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
