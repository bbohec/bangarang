import { IndividualContract } from '../../core/ports/IndividualContract';
import { fakeBangarang } from '../../adapters/primary/fakeBangarang';
import { retreiveRandomIndividual } from './retreiveRandomUser';
import { users } from './users';
export const defineCurrentIndividual = (): IndividualContract|undefined => {
    const individual = retreiveRandomIndividual(users);
    if (individual) fakeBangarang.userServiceProvider.suscribeIndividual(individual);
    return individual;
};
