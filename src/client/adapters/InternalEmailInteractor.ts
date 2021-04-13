import type { EmailInteractorContract } from "../port/interactors/EmailInteractorContract";
export class InternalEmailInteractor implements EmailInteractorContract {
    isEmailValid(email:string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    
}