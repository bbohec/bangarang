import { UserBuilder } from "../businessLogic/UserBuilder";
import type { ClaimContract } from "../port/ClaimContract";
import type { UserContract } from "../port/UserContact";
import { FakeBangarangClaimInteractor } from "./FakeBangarangClaimInteractor";
import { FakeBangarangMembersInteractor } from "./FakeBangarangMembersInteractor";
import { FakeRegisteringUserNotificationInteractor } from "./FakeRegisteringUserNotificationInteractor";
import { SvelteBangarangUserInterfaceInteractor } from "./SvelteBangarangUserInterfaceInteractor";
import { SvelteClaimingUserNotificationInteractor } from "./SvelteClaimingUserNotificationInteractorContract";
import { SvelteDeclaringClaimUserNotificationInteractor } from "./SvelteDeclaringClaimUserNotificationInteractor";
import { SvelteRetrievingClaimUserNotificationInteractor } from "./SvelteRetrievingClaimUserNotificationInteractor";
import { SvelteSearchingClaimsUserNotificationInteractor } from "./SvelteSearchingClaimsUserNotificationInteractorContract";
import { SvelteSigningInUserNotificationInteractor } from "./SvelteSigningInUserNotificationInteractor";


const bangarangMembersInteractor = new FakeBangarangMembersInteractor()
const bangarangClaimInteractor=new FakeBangarangClaimInteractor()
demoClaims().forEach(claim => bangarangClaimInteractor.saveClaim(claim))
export const uiBangarangUserBuilder = new UserBuilder()
    .withBangarangClaimInteractor(bangarangClaimInteractor)
    .withBangarangMembersInteractor(bangarangMembersInteractor)
    .withBangarangUserInterfaceInteractor(new SvelteBangarangUserInterfaceInteractor())
    .withClaimingUserNotificationInteractor(new SvelteClaimingUserNotificationInteractor())
    .withDeclaringClaimUserNotificationInteractor(new SvelteDeclaringClaimUserNotificationInteractor())
    .withRetrievingClaimUserNotificationInteractor(new SvelteRetrievingClaimUserNotificationInteractor())
    .withSearchingClaimsUserNotificationInteractor(new SvelteSearchingClaimsUserNotificationInteractor())
    .withSigningInUserNotificationInteractor(new SvelteSigningInUserNotificationInteractor())

const guest:UserContract={username:"",fullname:"","email":""}
const demoUser:UserContract={username:"demo",fullname:"Demo User","email":"demo@demo.demo"}
const demoUserPassword="demo"
uiBangarangUserBuilder
    .withUserContract(demoUser)
    .getUser()
    .registering(demoUserPassword)
uiBangarangUserBuilder
    .withUserContract(guest)
    .resetUser()


function demoClaims(): Array<ClaimContract> {
    const claims = new Array<ClaimContract>();
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    peopleClaimedFor:1,
    title: "MonResto only offers meat in its menus, he needs at least one menu with only Vegan ingredients.",
    id:"claim1",
    type:"Simple"
});
claims.push({ 
    peopleClaimed:3215575,
    peopleClaimedAgainst:1227755,
    peopleClaimedFor:1987820,
    title: "Does MonResto offer too much meat in its menus?",
    id:"claim2" ,
    type:"Simple"
});
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    peopleClaimedFor:1,
    title: "PasMonResto does not offer meat.",
    id:"claim3" ,
    type:"Simple"
});
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    peopleClaimedFor:1,
    title: "What are the conditions of validity of an article of the constitution of the Awesome App team?",
    id:"claim4" ,
    type:"Simple"
});
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    peopleClaimedFor:1,
    title: "Thundercats are on the move, Thundercats are loose. Feel the magic, hear the roar, Thundercats are loose. Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thundercats! ",
    id:"claim5" ,
    type:"Simple"
});
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    peopleClaimedFor:1,
    title: "Top Cat! The most effectual Top Cat! Who’s intellectual close friends get to call him T.C., providing it’s with dignity. Top Cat! The indisputable leader of the gang. He’s the boss, he’s a pip, he’s the championship. He’s the most tip top, Top Cat. ",
    id:"claim6",
    type:"Simple"
});
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    peopleClaimedFor:1,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a lorem vitae sem viverra consequat. Nam a nisl volutpat, suscipit ipsum vitae, feugiat tellus. Vivamus in facilisis dolor. Proin id euismod nisl. Vestibulum a ligula arcu. Ut nec urna convallis, facilisis sem vel, viverra magna. Curabitur vitae augue non urna cursus iaculis.",
    id:"claim7",
    type:"Simple"});
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    peopleClaimedFor:1,
    title: "In eu nulla quam. Vestibulum vulputate vestibulum dolor, nec bibendum urna interdum nec. Nulla dapibus auctor odio eu finibus. Cras finibus ante ac leo suscipit, eget pulvinar libero dignissim. Cras pulvinar aliquet est. Etiam a facilisis augue. Donec sit amet nisl diam. Phasellus sed vehicula metus. Suspendisse magna purus, finibus et aliquet eget, mattis id velit. Aenean tincidunt nec neque nec semper. Integer rutrum ac sem vitae lobortis. Etiam vitae iaculis dui. Phasellus fringilla elit quis metus fringilla, vitae mollis neque finibus.",
    id:"claim8",
    type:"Simple"
 });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    title: "Curabitur pulvinar pretium ex et accumsan. Nam fringilla ultrices sagittis. Suspendisse elementum nisi sed eros aliquet, ut congue nibh ornare. Nullam tincidunt eleifend libero, et iaculis libero pellentesque id. Integer sit amet urna vel leo malesuada ultrices. Aliquam vulputate, eros vel vestibulum mollis, tortor nulla laoreet purus, nec aliquam velit nunc vel quam. Cras vel ex dui. Duis ut nulla gravida, sodales lorem vitae, ornare enim. Cras sodales ligula sed eleifend ullamcorper. Aliquam tempus, libero eget consectetur laoreet, est purus facilisis sem, sit amet venenatis lorem massa vitae lorem. Etiam sit amet aliquet odio. Nulla et eros id nibh eleifend vestibulum nec vel dolor. Nulla commodo nulla vitae sem interdum, sit amet blandit velit elementum.",id:"claim9" });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim11",title: "Etiam enim ligula, blandit in congue at, vulputate quis metus. Donec eu ullamcorper quam. Donec vitae lectus ac dolor finibus aliquet vel ac est. Quisque orci nibh, dictum in interdum ut, faucibus eu justo. Donec lobortis mauris id tellus ullamcorper, et porta mi varius. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer sodales felis a neque rutrum, sit amet pharetra nisl luctus. In vehicula iaculis risus nec tempus. Nunc interdum congue condimentum. Nulla sodales porta lectus nec pretium." });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim12",title: "Sed lacinia nulla sed sapien mollis consequat. Nulla finibus eleifend metus, in dictum justo iaculis semper. Praesent sed est pellentesque, vulputate mi ut, vehicula leo. Aenean tempus egestas laoreet. Aenean rutrum placerat urna, non luctus est commodo sed. Mauris nec tristique ipsum. Nulla facilisi. Etiam a tristique quam, eu sagittis elit." });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim13",title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel leo quam. Integer sit amet tempor turpis. Aenean quis ex mollis, vulputate nunc quis, pulvinar ligula. Morbi luctus sem ac tortor mattis, sed semper magna rhoncus. Proin aliquam nisi eu mi feugiat blandit. Maecenas interdum eros tortor, sit amet posuere turpis dictum a. In ac arcu tincidunt, bibendum odio rutrum, mattis libero. Curabitur euismod, ipsum id tincidunt vehicula, justo metus lacinia dui, vel sodales tellus mi a leo." });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim14",title: "Quisque porttitor, metus quis tincidunt convallis, mi dui tristique urna, eu ornare neque lorem nec libero. Nullam ut pharetra dui, eget sollicitudin arcu. Donec sollicitudin arcu eu faucibus fringilla. Integer vitae pellentesque nulla, eget feugiat turpis. Aliquam id porttitor ex, ut vulputate nibh. Morbi quam ante, aliquet a tellus in, molestie tempus massa. Integer mollis turpis quis felis fringilla, ut dapibus orci aliquam. Nullam faucibus, erat eu vehicula bibendum, est ipsum scelerisque magna, posuere tempor libero mauris ac purus. Vestibulum pulvinar ante lectus, sollicitudin congue mauris sodales id. Duis porttitor ultricies lorem at tincidunt. Sed iaculis aliquet consectetur." });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim15",title: "Nulla eu magna augue. In mattis diam non felis efficitur, id semper libero aliquet. Nunc at ex nec orci pretium fringilla sed sit amet nibh. Duis id lobortis nulla. Aenean vitae purus tempus, tristique justo et, semper felis. Vestibulum in pretium dolor. Curabitur accumsan, nisi nec pretium dignissim, tellus augue luctus arcu, nec ultricies ligula lorem bibendum mauris. Phasellus at massa ante. Phasellus tincidunt placerat nisi, et accumsan dui consectetur aliquam. Etiam ultrices, velit ac euismod consectetur, ligula nunc imperdiet leo, ut laoreet erat velit ultrices ipsum. Proin non augue sapien. Phasellus sagittis ut elit at dictum. Nam malesuada eleifend cursus. Curabitur iaculis dolor vitae massa molestie, sed convallis velit dictum." });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim16",title: "Donec ullamcorper ut arcu eget rutrum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus nec ipsum pretium, sagittis nisi ut, volutpat sem. Integer rhoncus, leo eu feugiat hendrerit, massa purus varius lectus, id pharetra augue purus id justo. Suspendisse est diam, scelerisque ut commodo et, sollicitudin quis elit. Donec vestibulum tristique consectetur. Suspendisse eleifend pellentesque ipsum, vel mollis lacus luctus in." });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim17",title: "Donec ac euismod justo. Cras consequat, orci non pellentesque gravida, dolor urna porta nisi, ut luctus odio enim nec nibh. Phasellus vestibulum sapien non arcu porta suscipit. Duis consequat est dui, in rutrum diam varius vel. Cras iaculis, augue vel feugiat mollis, elit nulla imperdiet arcu, quis sagittis diam metus et lorem. Aenean sit amet finibus quam, ut sagittis dolor. Nulla ac hendrerit turpis, at lobortis risus. Phasellus nec magna ut sapien faucibus consequat. Interdum et malesuada fames ac ante ipsum primis in faucibus." });
claims.push({ 
    peopleClaimed:10,
    peopleClaimedAgainst:9,
    type:"Simple",
    peopleClaimedFor:1,
    id:"claim18",title: "Sed ultrices, lorem eleifend sagittis ultrices, purus lorem fringilla neque, at vulputate magna augue id erat. Ut pulvinar lacus vel dui mattis eleifend. Donec sit amet arcu mattis, sagittis purus quis, consequat augue. Curabitur risus orci, malesuada id gravida et, maximus id arcu. Nullam tristique euismod diam non imperdiet. Donec congue auctor erat, sit amet blandit tortor condimentum at. Curabitur lacinia purus a libero laoreet tristique. Donec aliquam, augue sed efficitur porttitor, mauris massa blandit quam, id venenatis tortor massa ac lectus. Ut tempus rhoncus urna vitae pharetra. Sed ullamcorper pretium nibh, eget pharetra neque cursus nec. Aliquam quis nibh id orci euismod accumsan. Maecenas dictum neque odio. Morbi eget ante feugiat, rutrum metus nec, lacinia metus. Suspendisse mollis, libero quis placerat luctus, erat libero dapibus ante, sed fringilla nulla felis eu purus. Vivamus non consectetur ipsum, in ullamcorper est. Nunc odio arcu, auctor ut elit sed, suscipit vehicula nulla." });
return claims
}
