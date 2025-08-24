import { Routes } from "@angular/router";
import { Scholarship } from "./scholarship/scholarship";
import { Library } from "./library/library";
import { Main } from "../../core/main/main";

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'login'},
    {path: 'supervisor', component: Main,
        children: [
            {
                path: 'library',
                component: Library,
                data: {breadcrumb: 'Library'}
            },
            {
                path: 'scholarship',
                component: Scholarship,
                data: {breadcrumb: 'Scholarship'}
            }
        ]
    }
];