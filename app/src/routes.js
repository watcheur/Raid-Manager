import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views

import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";


import CharactersOverview from "./views/CharactersOverview"
import EventsOverview from "./views/EventsOverview";
import OptionsOverview from "./views/OptionsOverview";
import EventDetail from "./views/EventDetail";
import EventManage from "./views/EventManage";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/characters" />
  },
  {
    path: "/characters",
    exact: true,
    layout: DefaultLayout,
    component: CharactersOverview
  },
  {
    path: "/events",
    exact: true,
    layout: DefaultLayout,
    component: EventsOverview
  },
  {
    path: "/events/:eventId",
    exact: true,
    layout: DefaultLayout,
    component: EventDetail
  },
  {
    path: "/events/:eventId/manage",
    exact: true,
    layout: DefaultLayout,
    component: EventManage
  },
  {
    path: "/options",
    exact: true,
    layout: DefaultLayout,
    component: OptionsOverview
  },
];