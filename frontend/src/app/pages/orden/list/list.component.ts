import { Component, OnInit } from "@angular/core";
import { Orden } from "src/app/models/Orden";
import { OrdenService } from "src/app/services/orden.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  ordenes: Orden[] = [];

  constructor(private ordenService: OrdenService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.ordenService.list().subscribe((data) => (this.ordenes = data || []));
  }

  create() {
    this.router.navigate(["/orden/create"]);
  }
  view(id: number) {
    this.router.navigate(["/orden/view", id]);
  }
  edit(id: number) {
    this.router.navigate(["/orden/update", id]);
  }

  delete(id: number) {
    Swal.fire({ title: "¿Eliminar?", showCancelButton: true }).then((res) => {
      if (res.isConfirmed)
        this.ordenService.delete(id).subscribe(
          () => {
            Swal.fire("Eliminado", "OK", "success");
            this.load();
          },
          () => Swal.fire("Error", "No se eliminó", "error")
        );
    });
  }
}
