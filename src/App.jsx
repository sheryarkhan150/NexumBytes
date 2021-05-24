import React, { useCallback, useEffect, useState } from "react";
import "antd/dist/antd.css";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import OnlineContext from "./context/online.context";
import RedirectContext from "./context/redirect.context";
import tokenService from "./services/token.service";
import AdminHomePage from "./components/AdminHomePage/AdminHomePage";
import UserProfile from "./components/UserProfile/UserProfile";
import tokenVerification from "./services/tokenVerification.service";
import AdminSignUp from "./components/AdminSignUp/AdminSignUp";
import Tenants from "./components/Tenants/Tenants";
import TenantProfile from "./components/Tenants/TenantProfile/TenantProfile";
import MainLayout from "./Layouts/MainLayout";
import TenantSubscriptions from "./components/Tenants/TenantSubscriptions/TenantSibscriptions";
import Subscriptions from "./components/Subscriptions/Subscriptions";
import AllFranchises from "./components/AllFranchises/AllFranchises";
import AuthLayout from "./Layouts/AuthLayout";

function App() {
  const [token, setToken] = useState();
  const [online, setOnline] = useState();
  const [redirect, setRedirect] = useState(false);
  const [username, setUsername] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState();

  if (token) {
    tokenService(token);
  } else {
    const oldToken = localStorage.getItem("token");
    if (oldToken) {
      setToken(oldToken);
    }
  }

  const verification = useCallback(async () => {
    const result = await tokenVerification(token);

    if (token && result) {
      setOnline(true);
    } else {
      setOnline(false);
    }
  }, [token]);

  useEffect(() => {
    verification();
    const username = localStorage.getItem("user");
    const id = localStorage.getItem("id");
    const name = localStorage.getItem("name");
    if (username && id) {
      setUsername(username);
      setId(id);
      setName(name);
    } else {
      setUsername("Profile");
      setId("id");
      setName("Account");
    }
  }, [token, verification]);

  return (
    <OnlineContext.Provider value={{ online, username, id, name }}>
      <RedirectContext.Provider value={{ redirect, setRedirect }}>
        <div className="App">
          <Router>
            {/* <Header /> */}
            <Switch>
              <Route path="/testing">
                <AuthLayout ComponentFromApp={AdminLogin} />
              </Route>
              <Route path="/login">
                <AuthLayout ComponentFromApp={AdminLogin} setToken={setToken} />
              </Route>
              <Route path="/signup">
                <AuthLayout ComponentFromApp={AdminSignUp} />
              </Route>
              <Route path="/user/:id">
                <MainLayout ComponentFromApp={UserProfile} />
              </Route>
              <Route path="/tenants">
                <MainLayout ComponentFromApp={Tenants} />
              </Route>
              <Route path="/tenant/:id">
                <MainLayout ComponentFromApp={TenantProfile} />
              </Route>
              <Route path="/subscription-plans/:tenantId">
                <MainLayout ComponentFromApp={TenantSubscriptions} />
              </Route>
              <Route path="/subscriptions">
                <MainLayout ComponentFromApp={Subscriptions} />
              </Route>
              <Route path="/franchises">
                <MainLayout ComponentFromApp={AllFranchises} />
              </Route>
              <Route exact path="/">
                <MainLayout ComponentFromApp={AdminHomePage} />
              </Route>
              {/* <Route path="/*" component={AdminHomePage} /> */}
            </Switch>
          </Router>
        </div>
      </RedirectContext.Provider>
    </OnlineContext.Provider>
  );
}

export default App;
