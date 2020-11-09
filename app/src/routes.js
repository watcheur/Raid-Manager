import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, LoginLayout, PublicLayout } from "./layouts";

// Route Views
import CharactersOverview from "./views/CharactersOverview"
import EventsOverview from "./views/EventsOverview";
import OptionsOverview from "./views/OptionsOverview";
import EventDetail from "./views/EventDetail";
import EventManage from "./views/EventManage";
import NotesOverview from "./views/NotesOverview";
import LoginView from "./views/LoginView";
import PlayerOverview from "./views/PlayerOverview";
import CharacterDetail from "./views/CharacterDetail";
import CharacterWishlist from "./views/CharacterWishlist";
import StatsOverview from "./views/StatsOverview";

export default [
  {
    path: "/login",
    exact: true,
    layout: LoginLayout,
    component: LoginView
  },
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/characters" />
  },
  {
    path: "/characters",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: CharactersOverview
  },
  {
    path: "/characters/:characterId",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: CharacterDetail
  },
  {
    path: "/characters/:characterId/wishlist",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: CharacterWishlist
  },
  {
    path: "/players",
    exact: true,
    layout: DefaultLayout,
    isPrivate: true,
    component: PlayerOverview
  },
  {
    path: "/events",
    exact: true,
    privatr: true,
    layout: DefaultLayout,
    component: EventsOverview
  },
  {
    path: "/events/:eventId",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: EventDetail
  },
  {
    path: "/events/:eventId/manage",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: EventManage
  },
  {
    path: "/notes",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: NotesOverview
  },
  {
    path: "/options",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: OptionsOverview
  },
  {
    path: "/stats",
    exact: true,
    isPrivate: true,
    layout: DefaultLayout,
    component: StatsOverview
  },
  {
    path: "/public/characters",
    exact: true,
    isPrivate: false,
    layout: PublicLayout,
    component: CharactersOverview
  }
];