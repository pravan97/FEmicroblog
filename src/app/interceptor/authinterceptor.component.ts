import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable, NgZone } from '@angular/core';
import { isEmpty, Observable } from 'rxjs';
import { ApiService } from '../apiService/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token:any;
  authReq: any;

  constructor(private authService: ApiService, private http:HttpClient, private _ngZone: NgZone) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    
    if (request.url.includes('rest')) 
   {
    const token = sessionStorage.getItem('access_token');
    
    
    // Clone the request and add the authentication token to the headers
     request = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
    // Pass the modified request on to the next handler in the chain
    return next.handle(request);
    
  }
}
