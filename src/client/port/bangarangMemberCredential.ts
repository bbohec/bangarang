export interface Credentials {
    username: string;
    password: string;
}
export const credentialsMissing=(username: string): string | undefined =>`Credentials missing for username ${username}`