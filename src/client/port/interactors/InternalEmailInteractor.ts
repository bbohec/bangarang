import type { EmaimInteractorContract } from "./EmailInteractorContract";

export class InternalEmailInteractor implements EmaimInteractorContract {
    isEmailValid(email:string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    
}