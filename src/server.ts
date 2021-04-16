import sirv from 'sirv';
import express from 'express';
import cors from 'cors'
import compression from 'compression';
import * as sapper from '@sapper/server';
import {json} from 'body-parser'
import type { ClaimChoice } from './client/port/ClaimChoice';
import type { BangarangMembersInteractorContract } from './client/port/interactors/BangarangMembersInteractorContract';
import type { BangarangClaimInteractorContract } from './client/port/interactors/BangarangClaimInteractorContract';
import type { ClaimContract, ClaimTitle, ClaimType, Identifier, PeopleClaimed, PeopleClaimedAgainst, PeopleClaimedFor } from './client/port/ClaimContract';
import { FakeBangarangMembersInteractor } from './client/adapters/FakeBangarangMembersInteractor';
import { FakeBangarangClaimInteractor } from './client/adapters/FakeBangarangClaimInteractor'
import { GcpDatastoreInteractor, GcpDatastoreInteractorConfiguration } from './client/adapters/GcpDatastoreInteractor';
import { GcpDatastoreBangarangMembersInteractor } from './client/adapters/GcpDatastoreBangarangMembersInteractor';
import { GcpDatastoreBangarangClaimInteractor } from './client/adapters/GcpDatastoreBangarangClaimInteractor';
const SUPPORTED_API_PREFIXES = ['restFakeMemberInteractor', 'restGcpDatastoreMemberInteractor','restFakeClaimInteractor','restGcpDatastoreClaimInteractor'] as const;
export type ApiPrefix = typeof SUPPORTED_API_PREFIXES[number];
const isApiPrefix = (apiPrefix: string): apiPrefix is ApiPrefix => SUPPORTED_API_PREFIXES.includes(apiPrefix as ApiPrefix)
const apiPrefixFromString = (string: string): ApiPrefix => {
    if (isApiPrefix(string)) return string
    throw new Error(`'${string} is not a supported API Prefix.`)
}
const GCP_DATASTORE_PROJECT_ID =process.env.GCP_DATASTORE_PROJECT_ID
const GCP_DATASTORE_CLIENT_EMAIL =process.env.GCP_DATASTORE_CLIENT_EMAIL
const GCP_DATASTORE_PRIVATE_KEY =process.env.GCP_DATASTORE_PRIVATE_KEY
let GCP_DATASTORE_KIND_PREFIX =process.env.GCP_DATASTORE_KIND_PREFIX
if(GCP_DATASTORE_PROJECT_ID === undefined) throw new Error(`GCP_DATASTORE_PROJECT_ID missing from environment variables.`)
if(GCP_DATASTORE_CLIENT_EMAIL === undefined) throw new Error(`GCP_DATASTORE_CLIENT_EMAIL missing from environment variables.`)
if(GCP_DATASTORE_PRIVATE_KEY === undefined) throw new Error(`GCP_DATASTORE_PRIVATE_KEY missing from environment variables.`)
if(GCP_DATASTORE_KIND_PREFIX === undefined) GCP_DATASTORE_KIND_PREFIX = '{"gcpKindPrefix":""}'
const gcpDatastoreInteractorConfiguration:GcpDatastoreInteractorConfiguration = {
	gcpProjectId:JSON.parse(GCP_DATASTORE_PROJECT_ID).gcpProjectId,
	gcpClientEmail:JSON.parse(GCP_DATASTORE_CLIENT_EMAIL).gcpClientEmail,
	gcpPrivateKey:JSON.parse(GCP_DATASTORE_PRIVATE_KEY).gcpPrivateKey,
	gcpKindPrefix:JSON.parse(GCP_DATASTORE_KIND_PREFIX).gcpKindPrefix
}
const gcpDatastoreInteractor = new GcpDatastoreInteractor(gcpDatastoreInteractorConfiguration)
const fakeBangarangMemberInteractor = new FakeBangarangMembersInteractor()
const gcpDatastoreBangarangMembersInteractor = new GcpDatastoreBangarangMembersInteractor(gcpDatastoreInteractor) 
interface BangarangMembersInteractor {
	adapter:BangarangMembersInteractorContract,
	apiPrefix:ApiPrefix
}
interface BangarangClaimInteractor {
	adapter:BangarangClaimInteractorContract,
	apiPrefix:ApiPrefix
}
const bangarangMembersInteractors:BangarangMembersInteractor[]=[
	{apiPrefix:"restFakeMemberInteractor",adapter:fakeBangarangMemberInteractor},
	{apiPrefix:"restGcpDatastoreMemberInteractor",adapter:gcpDatastoreBangarangMembersInteractor}
]
const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor('error')
const gcpDatastoreBangarangClaimInteractor = new GcpDatastoreBangarangClaimInteractor(gcpDatastoreInteractor) 
const bangarangClaimInteractors:BangarangClaimInteractor[]=[
	{apiPrefix:"restFakeClaimInteractor",adapter:fakeBangarangClaimInteractor},
	{apiPrefix:"restGcpDatastoreClaimInteractor",adapter:gcpDatastoreBangarangClaimInteractor}
]
const selectBangarangMemberInteractor = (apiPrefix:string)=> bangarangMembersInteractors.find(interactor=> interactor.apiPrefix===apiPrefixFromString(apiPrefix))
const selectBangarangClaimInteractor = (apiPrefix:string)=> bangarangClaimInteractors.find(interactor=> interactor.apiPrefix===apiPrefixFromString(apiPrefix))
const apiPrefix = `:apiPrefix`
const App = express();
App.use(json(),cors())
enum BangarangQueryParameters {
	ClaimTitle = "claimTitle",
	Username = "username",
	Password = "password"
}
const isQueryStringQuery = (query:unknown) : query is string => typeof query === 'string'
App.get(`/${apiPrefix}/claims`, (request, response) => {
	const bangarangClaimInteractor = selectBangarangClaimInteractor(request.params.apiPrefix)
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	if(!bangarangClaimInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else {
		const params = ["searchCriteria","claimTitle","id"]
		const paramFound = params.find(param => request.query[param] !== undefined)
		if (paramFound === undefined) sendErrorResponse(new Error(`No query params supported.'`))
		else {
			const query = request.query[paramFound]
			if (!isQueryStringQuery(query)) sendErrorResponse(new Error(`Query not supported : '${query}'`))
			else {
				const useCaseFromParamFound = (paramFound:string):Promise<ClaimContract[] | Error | ClaimContract> => {
					if(paramFound === "searchCriteria") return bangarangClaimInteractor.adapter.retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(query)
					if(paramFound === "claimTitle") return bangarangClaimInteractor.adapter.claimByTitleIncencitiveCase(query)
					if(paramFound === "id") return bangarangClaimInteractor.adapter.claimById(query)
					throw new Error ("unsupported param")
				}
				return useCaseFromParamFound(paramFound)
					.then(result => {
						if(result instanceof Error) throw result
						response.end(JSON.stringify(result))
					})
					.catch((error:Error) => sendErrorResponse(error))
			}
		}
	}
})
App.get(`/${apiPrefix}/isClaimExistByTitleUpperCase`, (request, response) => {
	const bangarangClaimInteractor = selectBangarangClaimInteractor(request.params.apiPrefix)
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	if(!bangarangClaimInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else {
		const query = request.query[BangarangQueryParameters.ClaimTitle]
		if (!isQueryStringQuery(query)) sendErrorResponse(new Error(`Query not supported : '${query}'`))
		else return bangarangClaimInteractor.adapter
			.isClaimExistByTitleIncensitiveCase(query)
			.then(isClaimExistByTitleUpperCase => {
				if(isClaimExistByTitleUpperCase instanceof Error) throw isClaimExistByTitleUpperCase
				response.end(JSON.stringify({isClaimExistByTitleUpperCase}))
			})
			.catch((error:Error) => sendErrorResponse(error))
	}
})
App.post(`/${apiPrefix}/saveClaim`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	const bangarangClaimInteractor = selectBangarangClaimInteractor(request.params.apiPrefix)
	const body:{
		type?:ClaimType,
		title?:ClaimTitle,
		peopleClaimed?:PeopleClaimed,
		peopleClaimedFor?:PeopleClaimedFor,
		peopleClaimedAgainst?:PeopleClaimedAgainst,
		id?:Identifier}=request.body
	if(	body.type===undefined || 
		body.title===undefined || 
		body.peopleClaimed === undefined ||
		body.peopleClaimedAgainst === undefined ||
		body.peopleClaimedFor === undefined ||
		body.id === undefined
	)sendErrorResponse(new Error("Missing type or title or peopleClaimed or peopleClaimedAgainst or peopleClaimedFor or id on body."))
	else if(!bangarangClaimInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangClaimInteractor.adapter
		.saveClaim({
			type:body.type,
			title:body.title,
			peopleClaimed:body.peopleClaimed,
			peopleClaimedAgainst:body.peopleClaimedAgainst,
			peopleClaimedFor:body.peopleClaimedFor,
			id:body.id
		})
		.then(result => {
			if(result instanceof Error) throw result
			response.end()
		})
		.catch((error:Error) => sendErrorResponse(error))
})
App.get(`/${apiPrefix}/isMemberExistWithUsername/:username`, (request, response) => {
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.isMemberExistWithUsername(request.params.username)
		.then(isMemberExistWithUsername => response.end(JSON.stringify({isMemberExistWithUsername})))
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
	const body:{claimId?:string,memberUsername?:string,claimChoice?:ClaimChoice}=request.body
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	if(body.claimId===undefined || body.memberUsername===undefined || body.claimChoice===undefined) sendErrorResponse(new Error("Missing claimId or memberUsername or claimChoice on body."))
	else if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else bangarangMemberInteractor.adapter
		.saveMemberClaim({claimId:body.claimId,memberUsername:body.memberUsername,claimChoice:body.claimChoice})
		.then(result => {
			if(result instanceof Error) throw result
			response.end()
		})
		.catch((error:Error) => sendErrorResponse(error))
})
App.post(`/${apiPrefix}/reset`, (request, response) => {
	const sendErrorResponse = (error:Error)=> {
		response.status(500).json({error:error.message})}
	if (apiPrefixFromString(request.params.apiPrefix) === "restFakeMemberInteractor") {
		fakeBangarangMemberInteractor
			.reset()
			.then(()=> response.end())
			.catch(error=>sendErrorResponse(error))
	}
	else if (apiPrefixFromString(request.params.apiPrefix) === "restGcpDatastoreMemberInteractor") {
		gcpDatastoreBangarangMembersInteractor
			.reset()
			.then(()=> response.end())
			.catch(error=>sendErrorResponse(error))
	}
	else if (apiPrefixFromString(request.params.apiPrefix) === "restFakeClaimInteractor") {
		fakeBangarangClaimInteractor
			.reset()
			.then(()=> response.end())
			.catch(error=>sendErrorResponse(error))
	}
	else if (apiPrefixFromString(request.params.apiPrefix) === "restGcpDatastoreClaimInteractor") {
		gcpDatastoreBangarangClaimInteractor
			.reset()
			.then(()=> response.end())
			.catch(error=>sendErrorResponse(error))
	}
	else sendErrorResponse(new Error (`Not bangarang member interactor with api prefix '${apiPrefixFromString(request.params.apiPrefix)}'.`))
})
App.get(`/${apiPrefix}/isCredentialsValid`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else {
		const queryUsername = request.query[BangarangQueryParameters.Username]
		const queryPassword = request.query[BangarangQueryParameters.Password]
		if (!isQueryStringQuery(queryUsername)) sendErrorResponse(new Error(`queryUsername not supported : '${queryUsername}'`))
		else if (!isQueryStringQuery(queryPassword)) sendErrorResponse(new Error(`queryPassword not supported : '${queryPassword}'`))
		else return bangarangMemberInteractor.adapter
			.isCredentialsValid({username:queryUsername,password:queryPassword})
			.then(isCredentialsValid => {
				if(isCredentialsValid instanceof Error) throw isCredentialsValid
				response.end(JSON.stringify({isCredentialsValid}))
			})
			.catch((error:Error) => sendErrorResponse(error))
	}
})
App.get(`/${apiPrefix}/retrieveUserContract`, (request, response) => {
	const sendErrorResponse = (error:Error)=> response.status(500).json({error:error.message})
	const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix)
	if(!bangarangMemberInteractor)sendErrorResponse(new Error(`bangarangMemberInteractor undefined`))
	else {
		const queryUsername = request.query[BangarangQueryParameters.Username]
		if (!isQueryStringQuery(queryUsername)) sendErrorResponse(new Error(`queryUsername not supported : '${queryUsername}'`))
		else return bangarangMemberInteractor.adapter
			.retrieveUserContract(queryUsername)
			.then(userContract => {
				if(userContract instanceof Error) throw userContract
				if(userContract === undefined) response.end()
				else response.end(JSON.stringify(userContract))
			})
			.catch((error:Error) => sendErrorResponse(error))
	}
})
App.use(
	compression({ threshold: 0 }),
	sirv('static', { dev:process.env.NODE_ENV === 'development' }),
	sapper.middleware()
)
App.listen(process.env.PORT);
//export default App
module.exports = App