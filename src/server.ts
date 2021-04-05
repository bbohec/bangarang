import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import {json} from 'body-parser'
import type { ClaimChoice } from './client/port/ClaimChoice';
import { FakeBangarangMembersInteractor } from './client/adapters/FakeBangarangMembersInteractor';
import { GcpDatastoreBangarangMembersInteractor } from './client/adapters/GcpDatastoreBangarangMembersInteractor';
import type { BangarangMembersInteractorContract } from './client/port/interactors/BangarangMembersInteractorContract';
import { Datastore, DatastoreOptions } from '@google-cloud/datastore';
import { GcpDatastoreInteractor } from './client/adapters/GcpDatastoreInteractor';
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
const bangarangPrivateKey:string = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFn4dnGWOcijgC\nzesWMOgv8wOUn4OM210bI+IQ3Gh1Wl9RtggiWHtKsKU3cumJKj39o1Z2c11J+tJQ\nw45gxk3HQoZmczJZ5G8KZkZ9RAMsm9rW7HUcxPC+Z2qePlzWEZXBxhkLVgJU20Yb\n4PrEkpN1Yuf2dfU9RKQWWIf4od8ufrZR5FLymIU/W+smDCjlxaWlcN3N+vNlkF5H\n4XLeupj3+lqO/fmpxL4OFA2PDlGJuD00aMhJCQ/l1jpO3g7cYA7tjYZXg77ODuLh\nx3+syQYHiNJpb/pdi5ELtimc4qNdDb+q3oBiFOu5CVUxBfvcUdurM5/MyJdeGz7q\nvFVe/MMfAgMBAAECggEAMXtfwmNbizMaki0wG0bUpEjjUR/dpvO4LNb/wDwH1bZy\nnnmHMN5ZxJpVS/x0WBlhGzR+Ljt1lNP+PCWy7S1KBUX1dAqNBXAKk56HMM9KQi2m\nDmF3c2QmaW5ohkXUJe+SQUoSNEHtZITg2ZMsBvMyg9ZngVEIvjYFJek15n3VbYTw\n7F1uzl69yk16drQFeZE4C9nGYdoFFK9AoIq5YuBsuZJ/8cRY++vdZc/d39Hwi8WM\nd+XIPpacgEzahCPVNnmsJgulyAe2YqIQb70G0kA+L8IE5ccpr2K9ahFwvsFpLKTl\nE/71cLMwIXCaSOWngPg5gYEUelZpbbE/vTvng4JNqQKBgQDrm2km5Wa9QQzT/QrQ\nG8ue1AjIwnliLpV+f9f/gW8hSe5svLFxB8zJ8kfOr9+1lmiJuPhtp6Bpx4Z5N54P\nd9GKi6OsLmbXXIEULvWEE7dMkkNKNrGp7t3fvEeNetWTW1ejc7FgdxTqQQsjIdDj\n3BkRW+ltavLC5umC4ZivPBFMxwKBgQDWungokV7tXT4w1A1BVPffOOePUkfChISl\npAZk3qqtVq3XPjpc3lSB9JLRAjVlyAyPRhScnaK6nn9C5Y5mviVH0SxWXOpJ8ux2\ntKtkvBGFydsCBQRKssTc4NdBL4EUD+Awj4HIcTgD1IpjTZZ7mAtif7yM5BpeF/D6\nHHle/Z0O6QKBgBI6DaJysMYHWES2GLYM0G3THXLaiKVt0SbeIQmlK8G5hHZpCpkh\n71fYJHH67SWRIzk0VBO3mhNU2jRadyHfNRiwwNK7LD2Q7HNxRpEXLWEBF6+QF6J7\n1jJO0IJDdG5X7Km6c4hw7e9JZOEs5ooaJt5O6/oJAgrN7lavuS4lSXlVAoGAJPwJ\nJjOjvg6JX6+meNJBv1j1yWHKql5Y2o7d6xHPI/wCBUjalJRWyetuPkG7IMTMJQFV\nG4SrOqmCEeuoE1o84ZnNoTJvyDznLasAumEKQ5j49+gVTShtb/3qFXgxK1twqeyN\n1hBqLX62N1RtzuvpShXmS/4d7IcDIpE09n+IRcECgYEAkdSraAmC250Bjz+WM3p+\nCpvQAZwy6KQNJBMMjMWWpA8FUTTKeGPuOkv1PB38Vz+e/3GSmPuOvZ5qJutUTmBL\n16GRsL96lHizJr1RvoN20JYg9Vzo7agIWbk3p2yvCNQi4zLzWhuSMB8bqVcTkiGk\nV76c6Sphhk93GhOP1g2JDlA=\n-----END PRIVATE KEY-----\n"
const bangarangClientEmail="publicdatastore@bangarang-309019.iam.gserviceaccount.com"
const datastoreOptions:DatastoreOptions = {
    projectId:"bangarang-309019",
    credentials:{
        client_email:bangarangClientEmail,
        private_key:bangarangPrivateKey
    }
} 
const gcpDatastoreInteractor = new GcpDatastoreInteractor(new Datastore(datastoreOptions))
const gcpDatastoreBangarangMembersInteractor = new GcpDatastoreBangarangMembersInteractor(gcpDatastoreInteractor) 
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