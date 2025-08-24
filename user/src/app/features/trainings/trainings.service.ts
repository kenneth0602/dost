import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {
  private readonly sharedService = inject(SharedService);

  trainings_url = environment.apiURL + '/training';

  forms_url = environment.apiURL + '/forms';

  selected_forms = environment.apiURL + '/selected/form';

  

  constructor(private http: HttpClient) { }

  // Trainings Functions

  getAllTrainings(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any,
    id: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching trainings...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.trainings_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}&id=${id}`,
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

  getFormById(
    jwt: any,
    id: number
  ): Observable<any> {
    this.sharedService.showLoader('Fetching forms...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.forms_url}?apID=${id}`,
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

  getFormsContentById(
    jwt: any,
    id: number
  ): Observable<any> {
    this.sharedService.showLoader('Fetching forms...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.selected_forms}?formID=${id}`,
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

  answerForm(
    data: any,
    jwt: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching forms...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any[]>(
        `${this.selected_forms}/submit`,
        data,
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

  getSelectedFormResponse(
    jwt: any,
    apId: number,
    userId: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching forms...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.selected_forms}/response?apid=${apId}&userid=${userId}`,
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

  getNtp(
    jwt: any,
    apcID: number,
    userId: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching forms...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.selected_forms}/ntp?apcID=${apcID}&id=${userId}`,
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

  geRegister(
    jwt: any,
    apcID: number,
    userId: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching forms...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.selected_forms}/register?apcID=${apcID}&empID=${userId}`,
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

  ntpParticipation(
    decision: any,
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating registration...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.selected_forms}/ntp/${decision}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('Registration created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  createRegistration(
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating registration...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.selected_forms}/register`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('Registration created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  //error handler
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Error: ${error}` +
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
