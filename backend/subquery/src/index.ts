//Exports all handler functions
import { atob } from "abab";
global.atob = atob;

import "@polkadot/api-augment";
export * from "./mappings/mappingHandlers";
