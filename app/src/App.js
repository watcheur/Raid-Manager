import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "./assets/blizzard.css";
import "./assets/toast.css";
import "./assets/override.css";

import Context from './utils/context';

export default () => (
  <DndProvider backend={Backend}>
  <Router basename={process.env.REACT_APP_BASENAME || ""}>
    <div>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={withTracker(props => {
              return (
                <route.layout {...props}>
                  <route.component {...props} />
                </route.layout>
              );
            })}
          />
        );
      })}
    </div>
  </Router>
  </DndProvider>
);
