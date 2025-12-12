import { Component, OnInit } from "@angular/core";
import { Menu } from "src/app/models/Menu";
import { MenuService } from "src/app/services/menu.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  menus: Menu[] = [];

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.menuService.list().subscribe((data) => (this.menus = data || []));
  }

  create() {
    this.router.navigate(["/menu/create"]);
  }
  view(id: number) {
    this.router.navigate(["/menu/view", id]);
  }
  edit(id: number) {
    this.router.navigate(["/menu/update", id]);
  }

  delete(id: number) {
    Swal.fire({ title: "¿Eliminar?", showCancelButton: true }).then((res) => {
      if (res.isConfirmed)
        this.menuService.delete(id).subscribe(
          () => {
            Swal.fire("Eliminado", "OK", "success");
            this.load();
          },
          () => Swal.fire("Error", "No se eliminó", "error")
        );
    });
  }
}
