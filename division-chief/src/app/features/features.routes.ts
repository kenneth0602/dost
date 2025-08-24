import { Routes } from '@angular/router';
import { MainComponent } from '../core/main/main.component';
import { LibraryComponent } from './library/library.component';
import { CompetencyComponent } from './competency/competency.component';
import { MyCompetencyComponent } from './competency/my-competency/my-competency.component';
import { DivisionCompetencyComponent } from './competency/division-competency/division-competency.component';
import { PlannedComponent } from './competency/division-competency/planned/planned.component';
import { UnplannedComponent } from './competency/division-competency/unplanned/unplanned.component';
import { EmployeesComponent } from './employees/employees.component';
import { FormsAndCertificatesComponent } from './forms-and-certificates/forms-and-certificates.component';
import { CertificatesComponent } from './forms-and-certificates/certificates/certificates.component';
import { FormsComponent } from './forms-and-certificates/forms/forms.component';
import { ScholarshipComponent } from './scholarship/scholarship.component';

export const routes: Routes = [
    {
        path: 'division-chief',
        component: MainComponent,
        children: [
            {
                path: 'library',
                component: LibraryComponent,
                data: { breadcrumb: 'Library' },
            },
            {
                path: 'competency',
                component: CompetencyComponent,
                data: { breadcrumb: 'Competency' },
            },
            {
                path: 'competency/my-competency',
                component: MyCompetencyComponent,
                data: { breadcrumb: 'My Competency' },
            },
            {
                path: 'competency/division-competency',
                component: DivisionCompetencyComponent,
                data: { breadcrumb: 'Division Competency' }
            },
            {
                path: 'competency/division-competency/planned',
                component: PlannedComponent,
                data: { breadcrumb: 'Planned Competency' }
            },
            {
                path: 'competency/division-competency/unplanned',
                component: UnplannedComponent,
                data: { breadcrumb: 'Unplanned Competency' }
            },
            {
                path: 'employees',
                component: EmployeesComponent,
                data: { breadcrumb: 'Employees' }
            },
            {
                path: 'forms-and-certificates',
                component: FormsAndCertificatesComponent,
                data: { breadcrumb: 'Forms and Certificates' }
            },
            {
                path: 'forms-and-certificates/certificates',
                component: CertificatesComponent,
                data: { breadcrumb: 'Certificates' }
            },
            {
                path: 'forms-and-certificates/forms',
                component: FormsComponent,
                data: { breadcrumb: 'Forms' }
            },
            {
                path: 'scholarship',
                component: ScholarshipComponent,
                data: { breadcrumb: 'Scholarship' }
            }
        ]
    }
];
