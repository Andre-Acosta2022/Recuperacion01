import { Routes } from '@angular/router';
import { Empleado } from './models/empleado';
import { EmpleadoComponent } from './empleado/empleado.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {

        path:'',
        component: HomeComponent,
        title:'Página Inicio'
    },
    {
        path:'empl',
        component: EmpleadoComponent,
        title:'Libro'
    },
    {
        path:'**',
        redirectTo:'',
        pathMatch:'full'
    }
    
];
