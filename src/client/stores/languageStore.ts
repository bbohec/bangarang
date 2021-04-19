import {Writable, writable} from 'svelte/store'
import type { Language } from '../logic/language'
export const languageStore:Writable<Language> = writable("en")