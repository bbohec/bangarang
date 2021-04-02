import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import {json} from 'body-parser'
import type { ClaimChoice } from './client/port/ClaimChoice';
import { FakeBangarangMembersInteractor } from './client/adapters/FakeBangarangMembersInteractor';
import { GcpDatastoreBangarangMembersInteractor } from './client/adapters/GcpDatastoreBangarangMembersInteractor';
import type { BangarangMembersInteractorContract } from './client/port/interactors/BangarangMembersInteractorContract';




const SUPPORTED_API_PREFIXES = ['fake', 'api'] as const;
type ApiPrefix = typeof SUPPORTED_API_PREFIXES[number];
const isApiPrefix = (apiPrefix: string): apiPrefix is ApiPrefix => SUPPORTED_API_PREFIXES.includes(apiPrefix as ApiPrefix)
const apiPrefixFromString = (string: string): ApiPrefix => {
    if (isApiPrefix(string)) return string
    throw new Error(`'${string} is not a supported API Prefix.`)
}
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const fakeBangarangMemberInteractor = new FakeBangarangMembersInteractor()
const gcpDatastoreBangarangMembersInteractor = new GcpDatastoreBangarangMembersInteractor() 
interface BangarangMembersInteractor {
	adapter:BangarangMembersInteractorContract,
	apiPrefix:ApiPrefix
}
const bangarangMembersInteractors:BangarangMembersInteractor[]=[
	{apiPrefix:"fake",adapter:fakeBangarangMemberInteractor},
	{apiPrefix:"api",adapter:gcpDatastoreBangarangMembersInteractor}
]
const selectBangarangMemberInteractor = (apiPrefix:string)=> bangarangMembersInteractors.find(interactor=> interactor.apiPrefix===apiPrefixFromString(apiPrefix))
const apiPrefix = `:apiPrefix`
const App = express();
App.use(json())
App.get(`/${apiPrefix}/isMemberExistWithUsername/:username`, (request, response) => {
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.isMemberExistWithUsername(request.params.username)
		.then(isMemberExistWithUsername => response.end(JSON.stringify({isMemberExistWithUsername})))
		.catch((error:Error) => sendErrorResponse(error))
})
App.get(`/${apiPrefix}/isSignedIn/:username`, (request, response) => {
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.isSignedIn(request.params.username)
		.then(isSignedIn => response.end(JSON.stringify({isSignedIn})))
		.catch((error:Error) => sendErrorResponse(error))
})
App.get(`/${apiPrefix}/retrievePreviousMemberClaimChoiceOnClaim/:username/:claimTitle`, (request, response) => {
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.retrievePreviousMemberClaimChoiceOnClaim(request.params.username,request.params.claimTitle)
		.then(retrievePreviousMemberClaimChoiceOnClaim => {
			if (retrievePreviousMemberClaimChoiceOnClaim instanceof Error)throw retrievePreviousMemberClaimChoiceOnClaim
			response.end(JSON.stringify({retrievePreviousMemberClaimChoiceOnClaim}))
		})
		.catch((error:Error) => sendErrorResponse(error))
})
App.post(`/${apiPrefix}/saveCredentials`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	const body:{username?:string,password?:string}=request.body
	if(body.username===undefined || body.password===undefined)sendErrorResponse(new Error("Missing username or password on body."))
	else if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.saveCredentials({username:body.username,password:body.password})
		.then(result => {
			if(result instanceof Error) throw result
			response.end()
		})
		.catch((error:Error) => sendErrorResponse(error))
})
App.post(`/${apiPrefix}/saveMember`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	const body:{username?:string,fullname?:string,email?:string}=request.body
	if(body.username === undefined || body.fullname === undefined || body.email === undefined) sendErrorResponse(new Error("Missing username or fullname or email on body."))
	else if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.saveMember({username:body.username,fullname:body.fullname,email:body.email})
		.then(result => {
			if(result instanceof Error) throw result
			response.end()
		})
		.catch((error:Error) => sendErrorResponse(error))
})
App.post(`/${apiPrefix}/saveMemberClaim`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	const body:{claimTitle?:string,memberUsername?:string,claimChoice?:ClaimChoice}=request.body
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	if(body.claimTitle===undefined || body.memberUsername===undefined || body.claimChoice===undefined) sendErrorResponse(new Error("Missing claimTitle or memberUsername or claimChoice on body."))
	else if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.saveMemberClaim({claimTitle:body.claimTitle,memberUsername:body.memberUsername,claimChoice:body.claimChoice})
		.then(result => {
			if(result instanceof Error) throw result
			response.end()
		})
		.catch((error:Error) => sendErrorResponse(error))
})
App.post(`/${apiPrefix}/reset`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	if (apiPrefixFromString(request.params.apiPrefix) === "fake") {
		fakeBangarangMemberInteractor
			.reset()
			.then(()=> response.end())
			.catch(error=>sendErrorResponse(error))
	}
	else if (apiPrefixFromString(request.params.apiPrefix) === "api") {
		gcpDatastoreBangarangMembersInteractor
			.reset()
			.then(()=> response.end())
			.catch(error=>sendErrorResponse(error))
	}
	else sendErrorResponse(new Error (`Not bangarang member interactor with api prefix '${apiPrefixFromString(request.params.apiPrefix)}'.`))
	
})
App.post(`/${apiPrefix}/signingIn`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	const body:{username?:string,password?:string}=request.body
	if(body.username===undefined || body.password===undefined)sendErrorResponse(new Error("Missing username or password on body."));
	else if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.signingIn({username:body.username,password:body.password})
		.then(result => {
			if(result instanceof Error) throw result
			response.end()
		})
		.catch((error:Error) => sendErrorResponse(error))
})
App.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)
App.listen(PORT);
export default App