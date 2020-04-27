import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import CharactersOverview from "./views/CharactersOverview"
import EventsOverview from "./views/EventsOverview";
import OptionsOverview from "./views/OptionsOverview";
import EventDetail from "./views/EventDetail";
import EventManage from "./views/EventManage";
import NotesOverview from "./views/NotesOverview";

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
    exact: false,
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
    path: "/notes",
    exact: true,
    layout: DefaultLayout,
    component: NotesOverview
  },
  {
    path: "/options",
    exact: true,
    layout: DefaultLayout,
    component: OptionsOverview
  },
];