import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {

  private readonly sharedService = inject(SharedService);

  certificate_url = environment.apiURL + '/certificate'
  view_certificate_url = environment.apiURL + '/view/certificate'

  constructor(private http: HttpClient) { }



  // Certificates

  getAllCertificates(
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
        `${this.certificate_url}/${id}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  createCertificate(
    id: any,
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating Certificate...');
    const options = {
      headers: new HttpHeaders({
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.certificate_url}/${id}`, data, options)
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

    viewEmployeeCertificateByID(id: number, jwt: any) {
    const options = {
      headers: new HttpHeaders().set('Authorization', jwt),
      responseType: 'blob' as 'json', // Ensure 'blob' is explicitly declared
    };

    return this.http.get<Blob>(`${this.view_certificate_url}/${id}`, options).
      pipe(
        retry(3),
        catchError(this.handleError)
      )
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
