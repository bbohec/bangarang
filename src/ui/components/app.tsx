import * as React from "react";
import { main } from './main';
import { retrieveUser } from './welcomePanel/retrieveUser';
import { defineCurrentIndividual } from './welcomePanel/defineCurrentIndividual';
import { fakeBangarang } from '../../adapters/primary/fakeBangarang';
import "../styles/src.css"
export const app:JSX.Element = main(retrieveUser(fakeBangarang, defineCurrentIndividual()));
