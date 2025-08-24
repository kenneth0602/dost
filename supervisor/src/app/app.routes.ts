import { Routes } from '@angular/router';
import { Main } from './core/main/main';
import { Library } from './features/page/library/library';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'login'},
    {path: 'supervisor', component: Main,
        children: [
            {
                path: 'library',
                component: Library
            }
        ]
    }
];
