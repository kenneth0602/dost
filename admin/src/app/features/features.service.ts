import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private readonly sharedService = inject(SharedService);

  // Training Provider
  training_provider_url = environment.apiURL + '/trainingProvider';

  // Payment Option
  payment_options_url = environment.apiURL + '/paymentOption'

  // Subject Matter Expert
  sme_url = environment.apiURL + '/sme';
  sme_details_url = environment.apiURL + '/sme'
  enable_sme_url = environment.apiURL + '/SME';

  // Competency
  competency_url = environment.apiURL + '/competency';

  // ALDP
  aldp_url = environment.apiURL + '/aldp/year';
  proposed_aldp = environment.apiURL + '/aldp'

  // Training Program
  training_program_url = environment.apiURL + '/providerProgram'
  program_availability_url = environment.apiURL + '/program/provider/availability'
  schedule_url = environment.apiURL + '/availability'

  // Forms & Certificates
  certificates_url = environment.apiURL + '/certificates'
  approve_certificates_url = environment.apiURL + '/approve/certificates'
  reject_certificates_url = environment.apiURL + '/reject/certificates'
  employees_certificates_url = environment.apiURL + '/employees/certificates'

  forms_url = environment.apiURL + '/forms'
  selected_form_url = environment.apiURL + '/selected/form'

  // Employees
  employees_url = environment.apiURL + '/employees'

  // Scholarships
  scholarship_url = environment.apiURL + '/scholarship'

  constructor(private http: HttpClient) { }

  // Functions for Payment Options

  createPaymentOptions(data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.post<any>(this.payment_options_url, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Payment Option created successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  updatePaymentOptions(id: number, data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.patch<any>(`${this.payment_options_url}/${id}`, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Payment Option created successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  getPaymentById(
    jwt: any,
    id: number
  ): Observable<any> {
    this.sharedService.showLoader('Fetching payments...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.payment_options_url}/trainingProvider/${id}`,
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

  getInactivePaymentById(
    jwt: any,
    id: number
  ): Observable<any> {
    this.sharedService.showLoader('Fetching inactive payments...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.payment_options_url}/inactive/${id}`,
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

  activatePaymentById(id: number): Observable<any> {
    this.sharedService.showLoader('Activating payment...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    return this.http
      .put<any>(`${this.payment_options_url}/${id}`, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Payment activated successfully.'
          )
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  deactivatePaymentById(jwt: any, id: number): Observable<any> {
    this.sharedService.showLoader('Deactivating payment...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .delete<any>(`${this.payment_options_url}/${id}`, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Payment deactivated successfully.'
          )
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  // Funtions for Training Provider

  getAllTrainingProviders(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training providers...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };

    return this.http
      .get<any[]>(
        `${this.training_provider_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
        options
      )
      .pipe(
        map((data) => data),
        retry(1),
        catchError((error) => {
          if (error.status === 401) {
            console.error('Unauthorized request - 401');
          }

          // Provide a friendly, readable error message
          const friendlyMessage =
            error?.error?.message ||
            error?.message ||
            `HTTP ${error.status}: ${error.statusText}` ||
            'An unknown error occurred';

          this.sharedService.handleError(friendlyMessage);
          return throwError(() => new Error(friendlyMessage));
        }),
        finalize(() => this.sharedService.hideLoader())
      );
  }


  createTrainingProvider(data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.post<any>(this.training_provider_url, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Training provider created successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  updateTrainingProvider(id: number, data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Updating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .patch<any>(`${this.training_provider_url}/${id}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Training provider updated successfully.'
          )
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  viewTrainingProviderDetails(
    jwt: any,
    id: number
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training providers...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.training_provider_url}/${id}`,
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

  activateTrainingProvider(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Activating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .delete<any>(`${this.training_provider_url}/Enable/${id}`, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess(
            'Training provider activated successfully.'
          )
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  deactivateTrainingProvider(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Deactivating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .delete<any>(`${this.training_provider_url}/${id}`, options)
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

  getTrainingProvidersDropDown(jwt: any): Observable<any> {
    this.sharedService.showLoader('Fetching subject matter experts...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(`${this.training_provider_url}/dd`, options)
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

  // _____________________________________________________________________________________________

  // Subject Matter Expert Functions

  getAllSme(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching subject matter experts...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.sme_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  createSme(data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating subject matter expert...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.post<any>(this.sme_url, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Subject Matter Expert created successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  updateSme(id: number, data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Updating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.patch<any>(`${this.sme_url}/${id}`, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Training provider updated successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  getSmeDetails(
    jwt: any,
    id: number
  ): Observable<any> {
    this.sharedService.showLoader('Fetching subject matter experts...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.sme_url}/${id}`,
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

  activateSme(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Activating subject matter expert...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.put<any>(`${this.enable_sme_url}/${id}`, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Subject matter expert activated successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  deactivateSme(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Deactivating subject matter expert...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.delete<any>(`${this.sme_url}/${id}`, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Subject matter expert deactivated successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  // _____________________________________________________________________________________________

  // Competency Functions

  getAllPlannedCompetency(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching subject matter experts...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.competency_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  getAllUnplannedCompetency(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching unplanned competency...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.competency_url}/wishlist?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  createCompetencyWishlist(
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating competency wishlist...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.competency_url}/wishlist`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('Wishlist created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  getAllCompetencyAssessmentByYear(
    year: number,
    jwt: any,
    pageNo: any,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching subject matter experts...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.competency_url}/planned?&pageNo=${pageNo}&pageSize=${pageSize}&year=${year}`,
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

  // ALDP Functions

  getAllALDPYear(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching aldp years...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.aldp_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  getALDPByYear(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching aldp years...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.aldp_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  createALDPYear(
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating aldp year...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(this.aldp_url, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('ALDP year created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

getAllPrposedALDP(
    year: number,
    jwt: any,
    pageNo: any,
    pageSize: any,
    keyword: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching proposed aldp...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.proposed_aldp}/proposed?&pageNo=${pageNo}&pageSize=${pageSize}&year=${year}&keyword=${keyword}`,
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

  // Training Program Functions

  getAllTrainingProgram(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
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
        `${this.training_program_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  createTrainingProgram(
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating aldp year...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(this.training_program_url, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('ALDP year created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  addDetailsToTrainingProgram(
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating aldp year...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .patch<any>(this.training_program_url, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('ALDP year created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  createTrainingProviderInProgram(
    id: number,
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .put<any>(`${this.training_program_url}/provider/${id}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('ALDP year created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  createTrainingSchedule(
    id: number,
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.schedule_url}?provID=${id}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('ALDP year created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  getTrainingProgramDetails(
    jwt: any,
    id: number
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
        `${this.training_program_url}/details/${id}`,
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

  getTrainingAvailability(
    jwt: any,
    provId: number,
    progId: number
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
        `${this.program_availability_url}?pprogID=${progId}&provID=${provId}`,
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

  // Forms & Certificates Functions

  getAllEmployeesCertificates(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
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
        `${this.employees_url}/certificates?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  approveCertificateById(
    id: number,
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.approve_certificates_url}?certID=${id}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('ALDP year created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  viewCertificateByID(id: number, jwt: any) {
    const options = {
      headers: new HttpHeaders().set('Authorization', jwt),
      responseType: 'blob' as 'json', // Ensure 'blob' is explicitly declared
    };

    return this.http.get<Blob>(`${this.employees_certificates_url}/${id}`, options).
      pipe(
        retry(3),
        catchError(this.handleError)
      )
  }

  viewEmployeeCertificateByID(id: number, jwt: any) {
    const options = {
      headers: new HttpHeaders().set('Authorization', jwt),
      responseType: 'blob' as 'json', // Ensure 'blob' is explicitly declared
    };

    return this.http.get<Blob>(`${this.certificates_url}/${id}`, options).
      pipe(
        retry(3),
        catchError(this.handleError)
      )
  }

  getEmployeeCertificateById(id: number, jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating employee certificates...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any>(`${this.employees_certificates_url}/${id}`, options)
      .pipe(
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  rejectCertificateByID(
    id: number,
    data: any,
    jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating training provider...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .post<any>(`${this.reject_certificates_url}?certID=${id}`, data, options)
      .pipe(
        tap(() =>
          this.sharedService.handleSuccess('ALDP year created successfully.')
        ),
        map((data) => data),
        retry(3),
        catchError(this.handleError),
        finalize(() => this.sharedService.hideLoader())
      );
  }

  getAllRequestCertificates(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
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
        `${this.certificates_url}?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  getAllProgramForms(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
  ): Observable<any> {
    this.sharedService.showLoader('Fetching programs forms...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.forms_url}/program?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  createForms(data: any, jwt: any): Observable<any> {
    this.sharedService.showLoader('Creating forms...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.post<any>(this.forms_url, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Forms created successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  updateForms(data: any, jwt: any, id: any): Observable<any> {
    this.sharedService.showLoader('Creating forms...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.put<any>(`${this.selected_form_url}?formID=${id}`, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Forms created successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  getAldpById(
    jwt: any,
    id: number
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

  getResponseById(
    jwt: any,
    id: number,
    type: string
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
        `${this.selected_form_url}/response?apID=${id}&formType=${type}`,
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

  getFormByFormID(
    jwt: any,
    id: number
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
        `${this.selected_form_url}?formID=${id}`,
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

  getDetailsForGenerateNTP(
    jwt: any,
    id: number
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
        `${this.selected_form_url}/ntptemplate?apcID=${id}`,
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

  createNtp(data: any, jwt: any, date: any, id: any): Observable<any> {
    this.sharedService.showLoader('Creating forms...');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http.post<any>(`${this.selected_form_url}/ntptemplate?dueDate${date}&apcID=${id}`, data, options).pipe(
      tap(() =>
        this.sharedService.handleSuccess(
          'Forms created successfully.'
        )
      ),
      map((data) => data),
      retry(3),
      catchError(this.handleError),
      finalize(() => this.sharedService.hideLoader())
    );
  }

  createNtps(
    jwt: any,
    id: number
  ): Observable<any> {
    this.sharedService.showLoader('Fetching ntp...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt,
      }),
    };
    return this.http
      .get<any[]>(
        `${this.selected_form_url}/ntptemplate?apcID=${id}`,
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

  getFormNtpById(
    jwt: any,
    id: number
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
        `${this.selected_form_url}/ntp?apcID=${id}`,
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

  getFormRegisterById(
    jwt: any,
    id: number
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
        `${this.selected_form_url}/register?apcID=${id}`,
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


  // Scholarship Functions

  getAllLocalScholarships(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
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
        `${this.scholarship_url}/local?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

  getAllForeignScholarships(
    jwt: any,
    pageNo: any,
    keyword: string,
    pageSize: any
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
        `${this.scholarship_url}/foreign?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`,
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


  // Error handler
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
        `body was: ${error.error}`
      );
    }

    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
