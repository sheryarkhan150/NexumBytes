import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter,} from "react-router-dom";

import './index.css';
import './assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/scss/argon-dashboard-react.scss';

import App from "./App";

ReactDOM.render(
    <BrowserRouter>
        <App></App>
    </BrowserRouter>,
    document.getElementById("root")
);
