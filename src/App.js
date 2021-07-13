import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

import './App.css';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <React.Fragment>
      <ToastContainer/>
      <Switch>
        <Route path="/dashboard" render={(props) => <DashboardLayout {...props} />} />
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Redirect from="/" to="/auth" />
      </Switch>
    </React.Fragment>
  );
}

export default App;
