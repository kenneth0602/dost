import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {
  private readonly sharedService = inject(SharedService);

  competency_url = environment.apiURL + '/competency';

  constructor(private http: HttpClient) { }

  // Trainings Functions

  getAllAssignedCompetency(
    jwt: any,
    id: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching assigned competency...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.competency_url}/${id}/assigned`,
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

  getAllCompletedCompetency(
    jwt: any,
    id: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching completed competency...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.competency_url}/${id}/completed`,
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

  getAllUnservedCompetency(
    jwt: any,
    id: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching unserved competency...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.competency_url}/${id}/unserved`,
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
