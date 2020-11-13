import { IndividualContract } from '../../core/ports/IndividualContract';
import { uiBangarang } from '../uiBangarang';
import { retreiveRandomIndividual } from './retreiveRandomUser';
import { users } from './users';
export const defineCurrentIndividual = (): IndividualContract|undefined => {
    const individual = retreiveRandomIndividual(users);
    if (individual) uiBangarang.userServiceProvider.suscribeIndividual(individual);
    return individual;
};
