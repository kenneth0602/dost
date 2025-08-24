import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {
  private readonly sharedService = inject(SharedService);
  constructor(private http: HttpClient) { }

  applyScholarship() {
    this.sharedService.handleSuccess('Application submitted successfully!')
  }
}
