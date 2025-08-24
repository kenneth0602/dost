import { Routes } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { LibraryComponent } from './features/library/library.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'login'},
    {path: 'admin', component: MainComponent,
        children: [
            {
                path: 'library',
                component: LibraryComponent
            }
        ]
    }
    
];
