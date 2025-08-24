import { Injectable, inject } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { EndorsedRow, CriteriaResult, Signatories } from './selection-criteria/selection-criteria.component';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {

  private readonly sharedService = inject(SharedService);

  scholarship_url = environment.globalURL + '/scholarship';
  upload_scholarship_url = environment.globalURL + '/scholarship-upload'
  send_scholarchip_to_sdu_url = environment.globalURL + '/send-to-sdu/scholarship'
  view_scholarship = environment.globalURL + '/file/scholarship'
  employee_url = environment.globalURL + '/dropdown/employees'
  assign_employee = environment.globalURL + '/assign/scholarship/employees'


  constructor(private http: HttpClient) { }

  // service.ts
// Add a 3rd param: signatories (optional)
async generateEvaluationSheet(
  data: EndorsedRow[],
  filteredTitle: string,
  signatories?: Signatories
): Promise<Blob> {
  if (!data?.length) {
    console.error('No data found with the given title.');
    return Promise.reject('No data found with the given title.');
  }

  console.log('Generating PDF for titles:', data.map(d => d.scholarshipTitle));

  const templateUrl = 'Evaluation-Sheet.pdf'; // or 'assets/Evaluation-Sheet.pdf'
  const existingPdfBytes = await this.http.get(templateUrl, { responseType: 'arraybuffer' }).toPromise();
  if (!existingPdfBytes) throw new Error('Failed to load PDF template.');

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const templatePdf = await PDFDocument.load(existingPdfBytes);

  let currentPage = pdfDoc.getPages()[0];
  const entriesPerPage = 3;
  let entryIndex = 0;

  // Y coordinates (already set to the vertical middles of each section)
  const Y = (height: number) => ({
    relevance_mid: height - 380, // middle of Relevance block
    freq_mid:      height - 450, // middle of Frequency block
    perf_mid:      height - 505, // middle of Performance block
    transfer_mid:  height - 560, // middle of Transfer block
    total:         height - 613, // Total score row
  });

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];

    if (entryIndex > 0 && entryIndex % entriesPerPage === 0) {
      const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);
      currentPage = pdfDoc.addPage(templatePage);
    }

    const { height } = currentPage.getSize();

    // Left list (Name / Position / Division)
    const yRow = height - 135 - ((entryIndex % entriesPerPage) * 15);
    let x = 60;
    currentPage.drawText(`${entry.fullName}`, { x, y: yRow, size: 10, font: helveticaFont }); x += 200;
    currentPage.drawText(`${entry.position}`, { x, y: yRow, size: 10, font: helveticaFont }); x += 158;
    currentPage.drawText(`${entry.division}`, { x, y: yRow, size: 10, font: helveticaFont });

    // When a page group (up to 3) is complete or at the end, fill the right block
    if ((entryIndex + 1) % entriesPerPage === 0 || i === data.length - 1) {
      const startIndex = i - (entryIndex % entriesPerPage);
      const endIndex = i;
      const pageEntries = data.slice(startIndex, endIndex + 1);

      // “Applicant-Nominee/s” (top names)
      const yApplicantRow = 510;
      const COL_START_X = 345;
      const COL_WIDTH   = 70;
      const COL_GAP     = 5;
      const fontSize = 10;

      let xApplicant = COL_START_X;
      for (const pageEntry of pageEntries) {
        const words = pageEntry.fullName.split(' ');
        let line = ''; let y = yApplicantRow;
        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          const textWidth = helveticaFont.widthOfTextAtSize(testLine, fontSize);
          if (textWidth > COL_WIDTH) {
            currentPage.drawText(line, { x: xApplicant, y, size: fontSize, font: helveticaFont });
            y -= 12; line = word;
          } else {
            line = testLine;
          }
        }
        currentPage.drawText(line, { x: xApplicant, y, size: fontSize, font: helveticaFont });
        xApplicant += COL_WIDTH + COL_GAP;
      }

      // ✅ Draw numeric scores in the middle of each section, centered per column
      const yMap = Y(height);

      pageEntries.forEach((pe, idx) => {
        if (!pe.criteria) return;

        const b = pe.criteria.breakdown; // { relevance, frequency, performance, transfer }

        // Column X for this nominee
        const colX = COL_START_X + idx * (COL_WIDTH + COL_GAP);

        // Center text horizontally in the column
        const centerX = (text: string, size: number) =>
          colX + (COL_WIDTH - helveticaFont.widthOfTextAtSize(text, size)) / 2;

        const drawScore = (y: number, n: number, sizeNum = 11) => {
          const s = String(n);
          currentPage.drawText(s, { x: centerX(s, sizeNum), y, size: sizeNum, font: helveticaFont });
        };

        drawScore(yMap.relevance_mid, b.relevance);                 // Relevance (middle)
        if (pe.criteria.choices.frequency) drawScore(yMap.freq_mid, b.frequency); // Frequency (middle if applicable)
        drawScore(yMap.perf_mid, b.performance);                    // Performance (middle)
        drawScore(yMap.transfer_mid, b.transfer);                   // Transfer (middle)
        drawScore(yMap.total, pe.criteria.total, 12);               // Total
      });
    }

    entryIndex++;
  }

// === Signatories (draw on the last page) — names at custom positions ===
if (signatories) {
  const pages = pdfDoc.getPages();
  const page = pages[pages.length - 1]; // always the last page
  const { width, height } = page.getSize();

  // 1) Adjust these to match your template's signature lines/boxes
  const POS = {
    chair: { x: 120, y: 110 },                 // Chairperson (FAD)
    vice:  { x: 295, y: 110 },                 // Vice-Chairperson (FAD-AGSS)

    atd:   { x: 460, y: 110 },                  // Member (ATD)
    mprd:  { x: 120, y: 80 },                  // Member (MPRD)
    pd:    { x: 295, y: 80 },                  // Member (PD)
    pmd:   { x: 460, y: 80 },                  // Member (PMD)
    tdd:   { x: 120, y: 48 },                  // Member (TDD)
    tsss:  { x: 295, y: 48 },                  // Member (TSSS)

    rfr:   { x: 460, y: 48 },                  // Member (Rank and File Representative)
  };

  // 2) Helpers
  const NAME_SIZE = 11;
  const LABEL_SIZE = 8; // for "Date:" label if you want it
  const centerX = (text: string, size = NAME_SIZE) =>
    helveticaFont.widthOfTextAtSize(text, size) / 2;

  const drawCentered = (x: number, y: number, text?: string, size = NAME_SIZE) => {
    if (!text) return;
    page.drawText(text, { x: x - centerX(text, size), y, size, font: helveticaFont });
  };

  // If you kept titles in the dialog (even if not printed), we can match by title:
  const byTitle = (contains: string) =>
    signatories.members?.find(m => (m.title ?? '').toLowerCase().includes(contains.toLowerCase()))?.name;

  // If titles are missing, we can fallback to array order:
  const byIndex = (i: number) => signatories.members && signatories.members[i]?.name;

  // 3) Draw each role at its own spot (names only)
  // Chair
  drawCentered(POS.chair.x, POS.chair.y, signatories.chair?.name);

  // Vice-Chairperson
  // Prefer title match; fallback to first member slot if needed
  drawCentered(POS.vice.x, POS.vice.y, byTitle('Vice-Chairperson') || byIndex(0));

  // Members by title (fallback to array order if titles are missing)
  drawCentered(POS.atd.x,  POS.atd.y,  byTitle('(ATD)')  || byIndex(1));
  drawCentered(POS.mprd.x, POS.mprd.y, byTitle('(MPRD)') || byIndex(2));
  drawCentered(POS.pd.x,   POS.pd.y,   byTitle('(PD)')   || byIndex(3));
  drawCentered(POS.pmd.x,  POS.pmd.y,  byTitle('(PMD)')  || byIndex(4));
  drawCentered(POS.tdd.x,  POS.tdd.y,  byTitle('(TDD)')  || byIndex(5));
  drawCentered(POS.tsss.x, POS.tsss.y, byTitle('(TSSS)') || byIndex(6));
  drawCentered(POS.rfr.x,  POS.rfr.y,  byTitle('Rank and File') || byIndex(7));
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
