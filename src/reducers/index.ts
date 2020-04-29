import { ActionTypes } from 'actions';
import { getPathFromPage, goToPage } from 'routing';
import { setLang } from 'translations';
import { Dictionary, ITranslateResult } from 'utils/dictionary';
import biReporter from 'utils/biReporter';

export interface IAlphabets {
    latin: boolean;
    cyrillic: boolean;
    glagolitic: boolean;
}

export interface ILang {
    from: string;
    to: string;
}

export interface IMainState {
    lang: ILang;
    interfaceLang: string;
    isvSearchLetters: {
        from: string[];
        to: string[]
    };
    fromText: string;
    searchType: string;
    posFilter: string;
    flavorisationType: string;
    page: string;
    isLoading: boolean;
    isDetailModal: boolean;
    isTranslationsModal: boolean;
    searchExpanded: boolean;
    alphabetType: string;
    detailModal?: number;
    translationsModal?: number;
    rawResults: string[][];
    results: ITranslateResult[];
    alphabets: IAlphabets;
    notification?: string;
    favoriteList: {
        [key: string]: boolean;
    };
}

export function mainReducer(state: IMainState, { type, data }) {
    switch (type) {
        case ActionTypes.LANG: {
            const { fromText, flavorisationType, searchType, posFilter } = state;
            const lang = data;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                lang,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.SEARCH_TYPE: {
            const { flavorisationType, lang, fromText, posFilter } = state;
            const searchType = data;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                searchType,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FROM_TEXT: {
            const { searchType, flavorisationType, lang, posFilter } = state;
            const fromText = data;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                fromText,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.RUN_SEARCH: {
            const { searchType, flavorisationType, lang, fromText, posFilter } = state;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.CHANGE_ISV_SEARCH_LETTERS: {
            const { searchType, flavorisationType, lang, fromText, posFilter} = state;
            const isvSearchLetters = Dictionary.changeIsvSearchLetters(data);
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                isvSearchLetters,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FLAVORISATION_TYPE: {
            const { searchType, lang, fromText, posFilter } = state;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType: data,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                flavorisationType: data,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, data),
            };
        }
        case ActionTypes.POS_FILTER: {
            const { searchType, lang, fromText, flavorisationType } = state;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                flavorisationType,
                posFilter: data,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                posFilter: data,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, data),
            };
        }
        case ActionTypes.SET_PAGE:
            goToPage(getPathFromPage(data));
            return {
                ...state,
                page: data,
            };
        case ActionTypes.SET_NOTIFICATION:
            return {
                ...state,
                notification: data,
            };
        case ActionTypes.IS_LOADING:
            return {
                ...state,
                isLoading: data,
            };
        case ActionTypes.ALPHABET_TYPE:
            return {
                ...state,
                alphabetType: data,
            };
        case ActionTypes.DETAIL_IS_VISIBLE_MODAL:
            return {
                ...state,
                isDetailModal: data,
            };
        case ActionTypes.SET_FAVORITE:
            return {
                ...state,
                favoriteList: {
                    ...state.favoriteList,
                    [data]: !state.favoriteList[data],
                },
            };
        case ActionTypes.TRANSLATIONS_IS_VISIBLE_MODAL:
            return {
                ...state,
                isTranslationsModal: data,
            };
        case ActionTypes.SET_SEARCH_EXPAND:
            return {
                ...state,
                searchExpanded: data,
            };
        case ActionTypes.SET_INTERFACE_LANG:
            setLang(data);
            return {
                ...state,
                interfaceLang: data,
            };
        case ActionTypes.SET_DETAIL_MODAL:
            return {
                ...state,
                detailModal: data,
            };
        case ActionTypes.SET_TRANSLATIONS_MODAL:
            return {
                ...state,
                translationsModal: data,
            };
        case ActionTypes.SET_ALPHABETS:
            const alphabets = {
                ...state.alphabets,
                ...data,
            };
            if (!Object.values(alphabets).some(Boolean)) {
                alphabets.latin = true;
            }
            return {
                ...state,
                alphabets,
            };
        default:
            return state;
    }
}
