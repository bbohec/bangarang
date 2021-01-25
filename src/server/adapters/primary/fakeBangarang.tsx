import { Bangarang } from './Bangarang';
import { FakeBallotRepositoryProvider } from '../secondary/FakeBallotProvider';
import { FakeIdentityProvider } from '../secondary/FakeIdentityProvider';
export const fakeBangarang = new Bangarang(new FakeIdentityProvider([]), new FakeBallotRepositoryProvider([]));
