import { Component, OnInit } from "@angular/core";
import { Producto } from "src/app/models/Producto";
import { ProductoService } from "src/app/services/producto.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  productos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.productoService
      .list()
      .subscribe((data) => (this.productos = data || []));
  }

  create() {
    this.router.navigate(["/producto/create"]);
  }
  view(id: number) {
    this.router.navigate(["/producto/view", id]);
  }
  edit(id: number) {
    this.router.navigate(["/producto/update", id]);
  }

  delete(id: number) {
    Swal.fire({ title: "¿Eliminar?", showCancelButton: true }).then((res) => {
      if (res.isConfirmed)
        this.productoService.delete(id).subscribe(
          () => {
            Swal.fire("Eliminado", "OK", "success");
            this.load();
          },
          () => Swal.fire("Error", "No se eliminó", "error")
        );
    });
  }
}
