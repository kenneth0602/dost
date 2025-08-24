import { Routes } from "@angular/router";
import { MainComponent } from "../core/main/main.component";
import { LibraryComponent } from "./library/library.component";
import { TrainingsComponent } from "./trainings/trainings.component";
import { FormsComponent } from "./trainings/components/forms/forms.component";
import { CompetencyComponent } from "./competency/competency.component";
import { CertificatesComponent } from "./certificates/certificates.component";
import { ScholarshipsComponent } from "./scholarships/scholarships.component";

export const routes: Routes = [
    {
        path: 'user',
        component: MainComponent,
        children: [
            {
                path: 'library',
                component: LibraryComponent,
                data: { breadcrumb: 'Library' }
            },
            {
                path: 'trainings',
                component: TrainingsComponent,
                data: { breadcrumb: 'Trainings' }
            },
            {
                path: 'trainings/forms',
                component: FormsComponent,
                data: { breadcrumb: 'Forms', parentBreadcrumb: 'trainings' }
            },
            {
                path: 'competency',
                component: CompetencyComponent,
                data: { breadcrumb: 'Competency' }
            },
            {
                path: 'certificates',
                component: CertificatesComponent,
                data: { breadcrumb: 'Certificates' }
            },
            {
                path: 'scholarships',
                component: ScholarshipsComponent,
                data: { breadcrumb: 'Scholarships' }
            }
        ]
    }
]