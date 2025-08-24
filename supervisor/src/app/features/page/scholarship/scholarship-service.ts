import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { Shared } from '../../../shared/shared';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {

  private readonly sharedService = inject(Shared);

  scholarship_url = environment.apiURL + '/scholarship';
  upload_scholarship_url = environment.apiURL + '/scholarship-upload'
  send_scholarchip_to_sdu_url = environment.apiURL + '/send-to-sdu/scholarship'
  view_scholarship = environment.apiURL + '/file/scholarship'
  employee_url = environment.apiURL + '/dropdown/employees'
  assign_employee = environment.apiURL + '/notify/user'


  constructor(private http: HttpClient) { }
    
    getEligibleEMployees(
    pageNo: number,
    pageSize: Number,
    keyword: string,
    jwt: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training programs...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.scholarship_url}/eligible?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  getEmployeeList(
    jwt: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training programs...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.employee_url}`,
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

  getAllScholarships(
    pageNo: number,
    pageSize: Number,
    keyword: string,
    jwt: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training programs...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.scholarship_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  getScholarshipById(
    id: number,
    jwt: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training programs...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.view_scholarship}/${id}`,
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

    assignScholarshipToEmployees(
    data: any,
    jwt: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training programs...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any[]>(
        `${this.assign_employee}`, data,
        options
      )
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Successfully notified the employee.'
          )
        ),
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

  uploadScholarship(
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating Certificate...');
    const options = {
      headers: new HttpHeaders({
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.upload_scholarship_url}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('Certificate created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  updateScholarship(id: number, data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Updating training provider...');
    const options = {
      headers: new HttpHeaders({
        Authorization: jwt,
      }),
    };
    return this.http
      .put<any>(`${this.scholarship_url}/${id}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Scholarship updated successfully.'
          )
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  activateScholarship(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Activating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .patch<any>(`${this.scholarship_url}/${id}`, null, options)
      .pipe(
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  deactivateScholarship(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Deactivating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .delete<any>(`${this.scholarship_url}/${id}`, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Training provider deactivated successfully.'
          )
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  sendScholarshipToSDU(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Deactivating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .put<any>(`${this.send_scholarchip_to_sdu_url}/${id}`, null, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Training provider deactivated successfully.'
          )
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
