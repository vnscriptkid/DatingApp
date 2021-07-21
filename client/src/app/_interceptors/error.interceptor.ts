import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error) {
            switch (error.status) {
              case 400:
                if (error.error.errors) {
                  const modelStateErrors: any = [];

                  for (const errors of Object.values(error.error.errors)) {
                    modelStateErrors.push(errors);
                  }
                  
                  throw modelStateErrors.flat();
                } else {
                  this.toastr.error(error.error, error.status);
                }
                break;
              case 401:
                this.toastr.error("Unauthenticated", error.status);
                break;
              case 404:
                this.router.navigateByUrl("/not-found");
                break;
              case 500:
                const navigationExtras: NavigationExtras = { state: { error: error.error } }
                this.router.navigateByUrl("/server-error", navigationExtras);
                break;
              default:
                console.log('Something unexpected happens');
            }
          }
          throw error;
        })
      )
  }
}
