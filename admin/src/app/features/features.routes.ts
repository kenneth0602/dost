import { Routes } from '@angular/router';
import { MainComponent } from '../core/main/main.component';
import { TrainingProviderComponent } from './training-provider/training-provider.component';
import { SubjectMatterExpertComponent } from './subject-matter-expert/subject-matter-expert.component';
import { CompetencyComponent } from './competency/competency.component';
import { PlannedComponent } from './competency/planned/planned.component';
import { UnplannedComponent } from './competency/unplanned/unplanned.component';
import { LAndDPlanComponent } from './l-and-d-plan/l-and-d-plan.component';
import { ApprovedComponent } from './l-and-d-plan/approved/approved.component';
import { ProposedComponent } from './l-and-d-plan/proposed/proposed.component';
import { TrainingProgramsComponent } from './training-programs/training-programs.component';
import { ShcolarshipComponent } from './shcolarship/shcolarship.component';
import { FormsAndCertificatesComponent } from './forms-and-certificates/forms-and-certificates.component';
import { FormsComponent } from './forms-and-certificates/forms/forms.component';
import { CertificatesComponent } from './forms-and-certificates/certificates/certificates.component';
import { EmployeesComponent } from './employees/employees.component';
import { SignatoryComponent } from './signatory/signatory.component';
import { LibraryComponent } from './library/library.component';
import { ListComponent } from './forms-and-certificates/forms/list/list.component';
import { DetailsComponent as TpDetailsComponent } from './training-provider/details/details.component';
import { DetailsComponent as SmeDetailsComponent } from './subject-matter-expert/details/details.component';
import { DetailsComponent as TprogramDetailsComponent } from './training-programs/details/details.component';
import { ViewComponent } from './l-and-d-plan/proposed/view/view.component';
import { EmployeeCertificateComponent } from './forms-and-certificates/certificates/employee-certificate/employee-certificate.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: MainComponent,
        children: [
            {
                path: 'library',
                component: LibraryComponent,
                data: { breadcrumb: 'Library' },
            },
            {
                path: 'training-provider',
                component: TrainingProviderComponent,
                data: { breadcrumb: 'Training Provider' }
            },
            {
                path: 'training-provider/details',
                component: TpDetailsComponent,
                data: {breadcrumb: 'Training Provider Details'}
            },
            {
                path: 'subject-matter-expert',
                component: SubjectMatterExpertComponent,
                data: { breadcrumb: 'Subject Matter Expert' }
            },
            {
                path: 'subject-matter-expert/details',
                component: SmeDetailsComponent,
                data: {breadcrumb: 'Subject Matter Expert Details'}
            },
            {
                path: 'competency',
                component: CompetencyComponent,
                data: { breadcrumb: 'Competency' }

            },
            {
                path: 'competency/planned',
                component: PlannedComponent,
                data: { breadcrumb: 'Planned' }
            },
            {
                path: 'competency/unplanned',
                component: UnplannedComponent,
                data: { breadcrumb: 'Unplanned' }
            },
            {
                path: 'l-and-d-plan',
                component: LAndDPlanComponent,
                data: { breadcrumb: 'L & D Plan' }
            },
            {
                path: 'l-and-d-plan/approved',
                component: ApprovedComponent,
                data: { breadcrumb: 'Approved L & D Plan' }
            },
            {
                path: 'l-and-d-plan/proposed',
                component: ProposedComponent,
                data: { breadcrumb: 'Proposed L & D Plan' }
            },
            {
                path: 'l-and-d-plan/proposed/details',
                component: ViewComponent,
                data: { breadcrumb: 'Proposed Details L & D Plan' }
            },
            {
                path: 'training-programs',
                component: TrainingProgramsComponent,
                data: { breadcrumb: 'Training Programs' }
            },
            {
                path: 'training-programs/details',
                component: TprogramDetailsComponent,
                data: { breadcrumb: 'Training Program Details' }
            },
            {
                path: 'sholarship',
                component: ShcolarshipComponent,
                data: { breadcrumb: 'Sholarship' }
            },
            {
                path: 'forms-and-certificates',
                component: FormsAndCertificatesComponent,
                data: { breadcrumb: 'Forms and Certificates' }
            },
            {
                path: 'forms-and-certificates/forms',
                component: FormsComponent,
                data: { breadcrumb: 'Forms' }
            },
            {
                path: 'forms-and-certificates/forms/list',
                component: ListComponent,
                data: { breadcrumb: 'Forms List' }
            },
            {
                path: 'forms-and-certificates/certificates',
                component: CertificatesComponent,
                data: { breadcrumb: 'Certificates' }
            },
            {
                path: 'forms-and-certificates/certificates/employee-certificates',
                component: EmployeeCertificateComponent,
                data: { breadcrumb: 'Employee Certificates'}
            },
            {
                path: 'employees',
                component: EmployeesComponent,
                data: { breadcrumb: 'Employees' }
            },
            {
                path: 'signatories',
                component: SignatoryComponent,
                data: { breadcrumb: 'Signatories' }
            }
        ]
    }

];
