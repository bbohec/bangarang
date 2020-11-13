import { Bangarang } from '../adapters/primary/Bangarang';
import { FakeBallotRepositoryProvider } from '../adapters/secondary/FakeBallotProvider';
import { FakeIdentityProvider } from '../adapters/secondary/FakeIdentityProvider';
export const uiBangarang = new Bangarang(new FakeIdentityProvider([]), new FakeBallotRepositoryProvider([]));
