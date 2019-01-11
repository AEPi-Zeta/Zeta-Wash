import {Injectable, Inject} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PostsService {
    backendPath: string;

    constructor(private http: Http, private location: Location) {

    }

    getServerStatus(): Observable<boolean> {
        return this.http.post(this.backendPath + 'getServerStatus', {})
            .map(res => res.json());
    }

    getWashingStatus(): Observable<boolean> {
        return this.http.post(this.backendPath + 'getWashingStatus', {})
            .map(res => res.json());
    }

    getDryingStatus(): Observable<boolean> {
        return this.http.post(this.backendPath + 'getDryingStatus', {})
            .map(res => res.json());
    }

    getList(listType): Observable<any> {
        return this.http.post(this.backendPath + 'getList', {listType: listType})
            .map(res => res.json());
    }

    getLog(logType): Observable<any> {
        return this.http.post(this.backendPath + 'getLog', {logType: logType})
            .map(res => res.json());
    }

    addToList(listObj, onlyQueue): Observable<any> {
        return this.http.post(this.backendPath + 'addToList', {listObj: listObj, onlyQueue: onlyQueue})
            .map(res => res.json());
    }

    removeFromList(listObj, onlyQueue): Observable<any> {
        return this.http.post(this.backendPath + 'removeFromList', {listObj: listObj, onlyQueue: onlyQueue})
            .map(res => res.json());
    }

    checkAuth(pin: string): Observable<any> {
        return this.http.post(this.backendPath + 'checkPin', {pin: pin})
            .map(res => res.json());
    }

    getUsers(): Observable<any> {
        return this.http.post(this.backendPath + 'getUsers', {})
            .map(res => res.json());
    }

    getAuth(): Observable<any> {
        return this.http.post(this.backendPath + 'getAuth', {})
            .map(res => res.json());
    }

    getConfig(getDev = false) {
        let url = this.location.prepareExternalUrl('backend/config/default.json');
        if (getDev) {
            url = 'http://localhost:4200/assets/dev_config.json';
        }
        return this.http.get(url)
                        .map(res => res.json());
    }

    setConfig(config): Observable<any> {
        return this.http.post(this.backendPath + 'setConfig', {config: config})
            .map(res => res.json());
    }

    setAuth(auth): Observable<any> {
        return this.http.post(this.backendPath + 'setAuth', {auth: auth})
            .map(res => res.json());
    }

    sendEmailAlert(user: any, alertObject: any): Observable<any> {
        return this.http.post(this.backendPath + 'sendEmailAlert', {user: user, alertObject: alertObject})
            .map(res => res.json());
    }
}



