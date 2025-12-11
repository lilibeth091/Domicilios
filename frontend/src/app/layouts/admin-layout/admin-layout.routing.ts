import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'maps',           component: MapsComponent },
    {
        path: '',
        children: [
            {
                path: 'theaters',
                canActivate:[AuthenticationGuard],
                loadChildren: () => import('src/app/pages/theaters/theaters.module').then(m => m.TheatersModule)
            },
            {
                path: 'restaurante',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/restaurante/restaurante.module').then(m => m.RestauranteModule)
            },
            {
                path: 'producto',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/producto/producto.module').then(m => m.ProductoModule)
            },
            {
                path: 'menu',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/menu/menu.module').then(m => m.MenuModule)
            },
            {
                path: 'cliente',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/cliente/cliente.module').then(m => m.ClienteModule)
            },
            {
                path: 'orden',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/orden/orden.module').then(m => m.OrdenModule)
            },
            {
                path: 'moto',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/moto/moto.module').then(m => m.MotoModule)
            }
        ]
    }
];