import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { Shared } from '../shared/shared';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  private readonly sharedService = inject(Shared);

  notification_url = environment.notifURL + '/notifications'

  constructor(private http: HttpClient) { }

  getNotifications(jwt: any, pageSize: number, pageNumber: number): Observable<any> {
    this.sharedService.showLoader('Fetching notifications...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      })
    };
    return this.http
      .get<any[]>(
        `${this.notification_url}?pageSize=${pageSize}&pageNo=${pageNumber}`,
        options
      )
      .pipe(
        map((data) => data),
        retry(1),
        catchError((error) => {
          if (error.status === 401) {
            console.error('Unauthorized request - 401');
          }
          this.sharedService.handleError(error);
          return throwError(() => error);
        }),
        finalize(() => this.sharedService.hideLoader())
      );
  }
}
