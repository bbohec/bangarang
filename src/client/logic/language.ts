import { StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import { languageStore } from "../stores/languageStore";
import { goto } from '@sapper/app';
export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];
export const isSupportedLanguage = (language: string): language is Language => SUPPORTED_LANGUAGES.includes(language as Language)
export type MessageContract= {[Lang in Language]:string}
export class Message {
    constructor(private messageContract:MessageContract){}
    public getMessage(language:Language) {
        return this.messageContract[language]
    }
}
export type SelectLanguage = {
    [key in Language]:{
        languageText:string,
        selectYourLanguageMessage:string,
        linkToMainMenuWithLanguage:string
    }
}
export function assignLanguage(language:string){
    if (isSupportedLanguage(language)) languageStore.set(language)
}

export function redirectOnUnknownLanguage(language:string) {
    if(!isSupportedLanguage(language)) {
        const url = `/${StaticView.LanguageSelect}`
        goto(url)
    }
}