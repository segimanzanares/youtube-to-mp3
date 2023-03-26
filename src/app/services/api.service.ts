import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface HttpOptions {
    headers: HttpHeaders;
    body?: Object;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private http: HttpClient,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }


    private handleError(error: HttpErrorResponse): HttpErrorResponse {
        if (!window.navigator.onLine) {
            let msg = "No internet connection.";
            this.snackBar.open(msg, "Aceptar", {
                duration: 5000,
            });
        }
        else if ([0, 504].indexOf(error.status) !== -1) {
            let msg = "Server timed out.";
            this.snackBar.open(msg, "Aceptar", {
                duration: 5000,
            });
        }
        else if (error.status === 401 && this && this.router) {
            this.router.navigate(['auth/login']);
        }
        else if (error.status === 403) {
            this.snackBar.open(error.error.message, "Aceptar", {
                duration: 5000,
            });
            this.router.navigate(['home']);
        }
        else if (error.status === 500) {
            let msg = "An error occurred on the server when your request was being processed, we will solve the problem as soon as possible.";
            this.snackBar.open(msg, "Aceptar", {
                duration: 10000,
            });
        }
        return error;
    }

    public request<T = any>(method: string, urlPath: string, data: { [k: string]: any }): Observable<T> {
        let url: string = `${urlPath}`;
        let httpOptions: HttpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        let req: Observable<T>;
        if (method === 'post' || method === 'put') {
            if (data instanceof FormData) {
                if (httpOptions.headers !== null) {
                    httpOptions.headers = httpOptions.headers.delete('Content-Type');
                }
                req = this.http[method]<T>(url, data, httpOptions);
            }
            else {
                req = this.http[method]<T>(url, data, httpOptions);
            }
        }
        else if (method === 'delete') {
            httpOptions['body'] = data;
            req = this.http.delete<T>(url, httpOptions);
        }
        else {
            if (data) {
                url += '?';
                Object.keys(data).forEach(key => {
                    if ([null, undefined, ''].indexOf(data[key]) === -1) {
                        url += key + '=' + data[key] + '&';
                    }
                });
            }
            req = this.http.get<T>(url, httpOptions);
        }
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                this.handleError(error);
                throw error;
            })
        )
    }
}