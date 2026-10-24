import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    // =========================================================
    // API URL
    // =========================================================

    private apiUrl: string =
        environment.apiUrl;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    constructor(
        private http: HttpClient
    ) {}


    // =========================================================
    // BUILD URL
    // =========================================================

    private buildUrl(
        endpoint: string
    ): string {

        // Remove starting slash
        endpoint =
            endpoint.replace(/^\/+/, '');

        // Make sure API URL ends with slash
        const baseUrl =
            this.apiUrl.endsWith('/')
                ? this.apiUrl
                : this.apiUrl + '/';

        return baseUrl + endpoint;
    }


    // =========================================================
    // GET
    // =========================================================

    get(
        endpoint: string,
        params?: any
    ): Observable<any> {

        let httpParams =
            new HttpParams();


        if (params) {

            Object.keys(params)
                .forEach((key) => {

                    const value =
                        params[key];


                    if (
                        value !== null &&
                        value !== undefined &&
                        value !== ''
                    ) {

                        httpParams =
                            httpParams.set(
                                key,
                                value.toString()
                            );
                    }

                });

        }


        return this.http.get(
            this.buildUrl(endpoint),
            {
                params: httpParams
            }
        );
    }


    // =========================================================
    // POST
    // =========================================================

    post(
        endpoint: string,
        data: any
    ): Observable<any> {

        return this.http.post(
            this.buildUrl(endpoint),
            data
        );
    }


    // =========================================================
    // PUT
    // =========================================================

    put(
        endpoint: string,
        data: any
    ): Observable<any> {

        return this.http.put(
            this.buildUrl(endpoint),
            data
        );
    }


    // =========================================================
    // PATCH
    // =========================================================

    patch(
        endpoint: string,
        data: any
    ): Observable<any> {

        return this.http.patch(
            this.buildUrl(endpoint),
            data
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    delete(
        endpoint: string
    ): Observable<any> {

        return this.http.delete(
            this.buildUrl(endpoint)
        );
    }


    // =========================================================
    // POST FORM DATA
    // =========================================================

    postFormData(
        endpoint: string,
        data: FormData
    ): Observable<any> {

        return this.http.post(
            this.buildUrl(endpoint),
            data
        );
    }

}
