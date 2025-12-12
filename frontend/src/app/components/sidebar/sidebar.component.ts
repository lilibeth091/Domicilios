import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Panel',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/maps', title: 'Mapas',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/cliente/list', title: 'Clientes',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/menu/list', title: 'Menu',  icon:'ni-book-bookmark text-green', class: '' },
    { path: '/moto/list', title: 'Moto',  icon:'ni-delivery-fast text-pink', class: '' },
    { path: '/orden/list', title: 'Orden',  icon:'ni-cart text-purple', class: '' },
    { path: '/producto/list', title: 'Producto',  icon:'ni-basket text-blue', class: '' },
    { path: '/restaurante/list', title: 'Restaurante',  icon:'ni-shop text-red', class: '' },
    { path: '/login', title: 'Acceso',  icon:'ni-key-25 text-info', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  user: User;
  subscription:Subscription;

  constructor(private router: Router, public securityService:SecurityService) { 
     this.subscription = this.securityService.getUser().subscribe(data => {
      this.user = data;
    })
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}