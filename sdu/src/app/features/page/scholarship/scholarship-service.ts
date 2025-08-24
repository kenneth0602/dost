import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { Shared } from '../../../shared/shared';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

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
  assign_employee = environment.apiURL + '/assign/scholarship/employees' 


  constructor(private http: HttpClient) { }

// service.ts
async generateEvaluationSheet(data: any[], filteredTitle: string): Promise<Blob> {
if (data.length === 0) {
  console.error('No data found with the given title.');
  return Promise.reject('No data found with the given title.');
}

  console.log('Generating PDF for titles:', data.map(d => d.scholarshipTitle));

  const templateUrl = 'Evaluation-Sheet.pdf';
  const existingPdfBytes = await this.http.get(templateUrl, { responseType: 'arraybuffer' }).toPromise();
  if (!existingPdfBytes) throw new Error('Failed to load PDF template.');

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const templatePdf = await PDFDocument.load(existingPdfBytes);

  let currentPage = pdfDoc.getPages()[0];
  const entriesPerPage = 3;
  let entryIndex = 0;

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];

    if (entryIndex > 0 && entryIndex % entriesPerPage === 0) {
      const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);
      currentPage = pdfDoc.addPage(templatePage);
    }

    const { height } = currentPage.getSize();

    const yRow = height - 135 - ((entryIndex % entriesPerPage) * 15);
    let x = 60;
    currentPage.drawText(`${entry.fullName}`, { x, y: yRow, size: 10, font: helveticaFont });
    x += 200;
    currentPage.drawText(`${entry.position}`, { x, y: yRow, size: 10, font: helveticaFont });
    x += 158;
    currentPage.drawText(`${entry.division}`, { x, y: yRow, size: 10, font: helveticaFont });

    if ((entryIndex + 1) % entriesPerPage === 0 || i === data.length - 1) {
      const startIndex = i - (entryIndex % entriesPerPage);
      const endIndex = i;
      const pageEntries = data.slice(startIndex, endIndex + 1);

      const yApplicantRow = 510;
      let xApplicant = 345;
      const maxWidth = 70;
      const fontSize = 10;

      for (const pageEntry of pageEntries) {
        const words = pageEntry.fullName.split(' ');
        let line = '';
        let y = yApplicantRow;
        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          const textWidth = helveticaFont.widthOfTextAtSize(testLine, fontSize);
          if (textWidth > maxWidth) {
            currentPage.drawText(line, { x: xApplicant, y, size: fontSize, font: helveticaFont });
            y -= 12;
            line = word;
          } else {
            line = testLine;
          }
        }
        currentPage.drawText(line, { x: xApplicant, y, size: fontSize, font: helveticaFont });
        xApplicant += maxWidth + 5;
      }
    }

    entryIndex++;
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
}

  getEmployeeList(
    jwt: any,
    keyword: string
  ): Observable<any> {
    this.sharedService.showLoader('Fetching training programs...');
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: jwt
      }),
    };
    return this.http
      .get<any[]>(
        `${this.employee_url}?keyword=${keyword}`,
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
