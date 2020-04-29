import { IMainState } from '../reducers';
import debounce from 'lodash/debounce';

declare function ga(...args: any[]): void;

interface IAnalyticsDimensions {
    searchValue: string;
    searchLanguageFrom: string;
    searchLanguageTo: string;
    searchLanguage: string;
    searchFilterPos: string;
    searchFilterPart: string;
}

export class BiReporter {
    constructor() {
        this.search = debounce(this.search.bind(this), 3000);
        this.emptySearch = debounce(this.emptySearch.bind(this), 600);
    }

    public search(state: IMainState) {
        this._sendEvent('search', `search ${state.lang.from}`, state.fromText);
    }

    public performanceInit(time: number) {
        this._sendEvent('performance', 'init', undefined, time);
    }

    public performanceFID(time: number) {
        this._sendEvent('performance', 'fid', undefined, time);
    }

    public performanceSearch(time: number) {
        this._sendEvent('performance', 'search', undefined, time);
    }

    public emptySearch(state: IMainState) {
        this._sendEvent('search', `empty ${state.lang.from}`, state.fromText);
    }

    public setDimensions(state: IMainState) {
        this._setGaDimensions({
            searchValue: state.fromText,
            searchLanguageFrom: state.lang.from,
            searchLanguageTo: state.lang.to,
            searchLanguage: state.lang.from === 'isv' ? state.lang.to : state.lang.from,
            searchFilterPos: state.posFilter,
            searchFilterPart: state.searchType,
        });
    }

    private _setGaDimensions(dimensions: IAnalyticsDimensions) {
        if (typeof ga !== 'function') {
            return;
        }

        ga('set', 'dimension1', dimensions.searchValue);
        ga('set', 'dimension2', dimensions.searchLanguageFrom);
        ga('set', 'dimension3', dimensions.searchLanguageTo);
        ga('set', 'dimension4', dimensions.searchLanguage);
        ga('set', 'dimension5', dimensions.searchFilterPos);
        ga('set', 'dimension6', dimensions.searchFilterPart);
    }

    private _sendEvent(eventCategory: string, eventAction: string, eventLabel: string, eventValue?: number) {
        if (typeof ga !== 'function') {
            return;
        }

        ga('send', {
            hitType: 'event',
            eventCategory,
            eventAction,
            eventLabel,
            eventValue,
        });
    }
}

export default new BiReporter();
