import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import {json,OptionsJson} from 'body-parser'
import { FakeBangarangMembersInteractor } from './client/adapters/FakeBangarangMembersInteractor';
import type { ClaimChoice } from './client/port/ClaimChoice';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const bangarangMemberInteractor = new FakeBangarangMembersInteractor()
const App = polka();
const apiPrefix = "api"
App.use(json())
App.get(`/${apiPrefix}/isMemberExistWithUsername/:username`, (req, res) => {
	bangarangMemberInteractor
		.isMemberExistWithUsername(req.params.username)
		.then(isMemberExistWithUsername => res.end(JSON.stringify({isMemberExistWithUsername})))
		.catch(error => res.status(500).send(error))
})
App.get(`/${apiPrefix}/isSignedIn/:username`, (req, res) => {
	bangarangMemberInteractor
		.isSignedIn(req.params.username)
		.then(isSignedIn => res.end(JSON.stringify({isSignedIn})))
		.catch(error => res.status(500).send(error))
})
App.get(`/${apiPrefix}/retrievePreviousMemberClaimChoiceOnClaim/:username/:claimTitle`, (req, res) => {
	bangarangMemberInteractor
		.retrievePreviousMemberClaimChoiceOnClaim(req.params.username,req.params.claimTitle)
		.then(retrievePreviousMemberClaimChoiceOnClaim => {
			if (retrievePreviousMemberClaimChoiceOnClaim instanceof Error) {
				res.statusCode=500
				res.statusMessage=retrievePreviousMemberClaimChoiceOnClaim.message
				res.end()
			}
			else res.end(JSON.stringify({retrievePreviousMemberClaimChoiceOnClaim}))
		})
		.catch(error => res.status(500).send(error))
})
App.post(`/${apiPrefix}/saveCredentials`, (req, res) => {
	const body:{username?:string,password?:string}=req.body
	if(!body.username || !body.password)
		res.status(500).send(new Error("Missing username or password on body."));
	else bangarangMemberInteractor
		.saveCredentials({username:body.username,password:body.password})
		.then(result => {
			if(result instanceof Error) res.status(500).end(result)
			else res.end()
		})
		.catch(error => res.status(500).send(error))
})
App.post(`/${apiPrefix}/saveMember`, (request, response) => {
	console.log(request.url)
	console.log(request.body)
	console.log(request.headers)
	const body:{username?:string,fullname?:string,email?:string}=request.body
	if(!body.username || !body.fullname || !body.email) 
		response.status(500).send(new Error("Missing username or fullname or email on body."));
	else bangarangMemberInteractor
		.saveMember({username:body.username,fullname:body.fullname,email:body.email})
		.then(result => {
			if(result instanceof Error) response.status(500).end(result)
			else response.end()
		})
		.catch(error => response.status(500).send(error))
})
App.post(`/${apiPrefix}/saveMemberClaim`, (req, res) => {
	const body:{claimTitle?:string,memberUsername?:string,claimChoice?:ClaimChoice}=req.body
	if(!body.claimTitle || !body.memberUsername || !body.claimChoice)
		res.status(500).send(new Error("Missing claimTitle or memberUsername or claimChoice on body."));
	else bangarangMemberInteractor
		.saveMemberClaim({claimTitle:body.claimTitle,memberUsername:body.memberUsername,claimChoice:body.claimChoice})
		.then(result => {
			if(result instanceof Error) res.status(500).end(result)
			else res.end()
		})
		.catch(error => res.status(500).send(error))
})
App.post(`/${apiPrefix}/signingIn`, (req, res) => {
	const body:{username?:string,password?:string}=req.body
	if(!body.username || !body.password)
		res.status(500).send(new Error("Missing username or password on body."));
	else bangarangMemberInteractor
		.signingIn({username:body.username,password:body.password})
		.then(result => {
			if(result instanceof Error) res.status(500).end(result)
			else res.end()
		})
		.catch(error => res.status(500).send(error))
})
App.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)
App.listen(PORT, (error:Error) => {if (error) throw error});
	


	

export default App