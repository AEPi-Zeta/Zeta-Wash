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
        console.log('PostsService Initialized...');
        if (USE_SSL) {
            this.path = SERVER_URL_SSL_STRING;
        } else {
            this.path = SERVER_URL_STRING;
        }
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

    getList(listType, queueOnly): Observable<any> {
        return this.http.post(this.path + 'getList', {listType: listType, queueOnly: queueOnly})
            .map(res => res.json());
    }

    addToList(listObj, queueOnly): Observable<any> {
        return this.http.post(this.path + 'addToList', {listObj: listObj, queueOnly: queueOnly})
            .map(res => res.json());
    }

    removeFromList(listObj, queueOnly): Observable<any> {
        return this.http.post(this.path + 'removeFromList', {listObj: listObj, queueOnly: queueOnly})
            .map(res => res.json());
    }
}



