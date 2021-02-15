import type { ClaimedClaim } from "./ClaimedClaim";
export interface User {
    username: string;
    password: string;
    id: string;
    claimedClaims: ClaimedClaim[]
}


