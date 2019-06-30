import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BASE_URL, TOKEN } from '../constants/api';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any) {
    let paramsQuery = '?';
    for (let k in params) {
      paramsQuery += `&${k}=${params[k]}`;
    }
    paramsQuery += '&mode=json';
    paramsQuery += `&appid=${TOKEN}`;
    return this.http.get(BASE_URL + '/' + endpoint + paramsQuery);
  }

}

/*

import { HttpClient,HttpEvent,
  HttpParams,HttpInterceptor,HttpRequest,HttpResponse, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BASE_URL, TOKEN } from '../constants/api';



import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class Api   implements HttpInterceptor  {

 constructor(public http: HttpClient) {
 }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
   const started = Date.now();
   let ok: string;

   // extend server response observable with logging
   return next.handle(req)
     .pipe(
       tap(
         // Succeeds when there is a response; ignore other events
         event => ok = event instanceof HttpResponse ? 'succeeded' : '',
         // Operation failed; error is an HttpErrorResponse
         error => ok = 'failed'
       ),
       // Log when response observable either completes or errors
       finalize(() => {
         const elapsed = Date.now() - started;
         const msg = `${req.method} "${req.urlWithParams}"
            ${ok} in ${elapsed} ms.`;
            console.log(elapsed)
         //this.messenger.add(msg);
       })
     );
 } 



}*/