import type { Datastore, Entity, PathType, Query } from "@google-cloud/datastore";
import type { entity } from "@google-cloud/datastore/build/src/entity";
import type { Operator, RunQueryResponse } from "@google-cloud/datastore/build/src/query";
import { filter } from "compression";
import { response } from "express";
import { bangarangClaimNotFoundByTittleUpperCase } from "../port/interactors/BangarangClaimInteractorContract";
export class GcpDatastoreInteractor {
    constructor(gcpDatastore:Datastore) {
        this.gcpDatastore = gcpDatastore
    }
    public queryRecordsOnGoogleDatastore<T>(kind:string,filters:{property: string, operator: Operator, value: {}}[]):Promise<T[]|Error> {
        console.log(`⚙️  queryRecordsOnGoogleDatastore - ${kind} `)
        const query = this.gcpDatastore.createQuery(kind)
        filters.forEach(filter=> {
            console.log(`  ⚙️  ${filter.property}${filter.operator}${filter.value}`)
            query.filter(filter.property,filter.operator,filter.value)
        })
        return query.run()
            .then((queryResponse:RunQueryResponse)=> {
                const entities:T[] = queryResponse[0]
                filters.forEach(filter=> {if(filter.value === "ERROR") throw new Error(`Filter ${filter.value} Error`)})
                console.log(`✔️  ${entities.length} entities retrieved on kind ${kind} according to filters.`)
                return entities
            })
            .catch(error=> error)
    }
    public retreiveRecordOnGoogleDatastore<T>(keyPath:PathType[]):Promise<T|undefined|Error> {
        return new Promise<T|undefined|Error>((resolve)=>{
            console.log(`⚙️  retreiveRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = this.gcpDatastore.key(keyOption);
            this.gcpDatastore.get(key,(error,entity) => {
                if (error){
                    console.log(`❌ ${error.message}`)
                    resolve(error)
                }
                else if (!entity){
                    console.log(`⚠️  ${noEntityWithPathErrorMessage(keyPath)}`)
                    resolve(undefined)
                }
                else {
                    console.log(`✔️  Entity with key path ${keyPath.join("/")} retreived from datastore.`)
                    resolve (entity)
                }
            })
        })
    }
    public deleteRecordOnGoogleDatastore(keyPath:PathType[]):Promise<void|Error> {
        return new Promise<void|Error>((resolve)=>{
            console.log(`⚙️  deleteRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = this.gcpDatastore.key(keyOption);
            this.gcpDatastore.delete(key,(error) => {
                if (error) {
                    console.log(`❌  ${error.message}`)
                    resolve(error)
                }
                else {
                    console.log(`✔️  Entity with key path ${keyPath.join("/")} deleted on datastore.`)
                    resolve()
                }
            })
        })
    }
    public saveRecordOnGoogleDatastore(keyPath:PathType[],entity:Entity):Promise<void|Error> {
        return new Promise<void|Error>((resolve)=>{
            console.log(`⚙️  saveRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = this.gcpDatastore.key(keyOption);
            const callback = (error?:Error) => {
                if (error){ 
                    console.log(`❌  ${error.message}`)
                    resolve(error)
                }else {
                    console.log(`✔️  Entity with key path ${keyPath.join("/")} saved on datastore.`)
                    resolve()
                }
            }
            this.gcpDatastore.save({key: key,data: entity},()=>callback() ) 
        })
    }
    private gcpDatastore:Datastore
}
const noEntityWithPathErrorMessage = (keyPath:PathType[]):string => `No entity with path ${keyPath.join("/")}`