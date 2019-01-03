import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PostsService {
    path: string;

    constructor(private http: Http) {
    }

    getServerStatus(): Observable<boolean> {
        return this.http.post(this.path + 'getServerStatus', {})
            .map(res => res.json());
    }

    getWashingStatus(): Observable<boolean> {
        return this.http.post(this.path + 'getWashingStatus', {})
            .map(res => res.json());
    }

    getDryingStatus(): Observable<boolean> {
        return this.http.post(this.path + 'getDryingStatus', {})
            .map(res => res.json());
    }

    getList(listType): Observable<any> {
        return this.http.post(this.path + 'getList', {listType: listType})
            .map(res => res.json());
    }

    getLog(logType): Observable<any> {
        return this.http.post(this.path + 'getLog', {logType: logType})
            .map(res => res.json());
    }

    addToList(listObj, onlyQueue): Observable<any> {
        return this.http.post(this.path + 'addToList', {listObj: listObj, onlyQueue: onlyQueue})
            .map(res => res.json());
    }

    removeFromList(listObj, onlyQueue): Observable<any> {
        return this.http.post(this.path + 'removeFromList', {listObj: listObj, onlyQueue: onlyQueue})
            .map(res => res.json());
    }

    checkAuth(pin: string): Observable<any> {
        return this.http.post(this.path + 'checkPin', {pin: pin})
            .map(res => res.json());
    }

    getUsers(): Observable<any> {
        return this.http.post(this.path + 'getUsers', {})
            .map(res => res.json());
    }

    getAuth(): Observable<any> {
        return this.http.post(this.path + 'getAuth', {})
            .map(res => res.json());
    }

    getConfig(getDev = false) {
        let url = window.location.href + 'backend/config/default.json';
        if (getDev) {
            url = 'http://localhost:4200/assets/dev_config.json';
        }
        return this.http.get(url)
                        .map(res => res.json());
    }

    setConfig(config): Observable<any> {
        return this.http.post(this.path + 'setConfig', {config: config})
            .map(res => res.json());
    }

    setAuth(auth): Observable<any> {
        return this.http.post(this.path + 'setAuth', {auth: auth})
            .map(res => res.json());
    }

    sendEmailAlert(user: any, alertObject: any): Observable<any> {
        return this.http.post(this.path + 'sendEmailAlert', {user: user, alertObject: alertObject})
            .map(res => res.json());
    }
}



