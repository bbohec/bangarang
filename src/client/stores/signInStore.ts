import {Writable, writable} from 'svelte/store'
import type { SignInContract } from '../interfaces/SingInContract'
export const signInStore:Writable<SignInContract> = writable({signInStatus:"nothing"})

