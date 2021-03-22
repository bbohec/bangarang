import type { PasswordInteractorContract } from "../port/interactors/PasswordInteractorContract";
export class FakePasswordInteractor implements PasswordInteractorContract {
    isPasswordSecure(password: string): boolean {
        return password !== "password"
    }
}