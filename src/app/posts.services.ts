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

    getConfig() {
        return this.http.get(window.location.href + 'backend/config/default.json')
                        .map(res => res.json());
    }
}



