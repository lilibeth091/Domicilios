import { Component, OnInit } from "@angular/core";
import { Restaurante } from "src/app/models/Restaurante";
import { RestauranteService } from "src/app/services/restaurante.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  restaurantes: Restaurante[] = [];

  constructor(
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.restauranteService.list().subscribe({
      next: (data) => (this.restaurantes = data || []),
      error: (err) => console.error("Error loading restaurantes", err),
    });
  }

  create() {
    this.router.navigate(["/restaurante/create"]);
  }

  view(id: number) {
    this.router.navigate([`/restaurante/view/${id}`]);
  }

  edit(id: number) {
    this.router.navigate([`/restaurante/update/${id}`]);
  }

  remove(id: number) {
    Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.restauranteService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              "Eliminado",
              "Restaurante eliminado correctamente",
              "success"
            );
            this.load();
          },
          error: () =>
            Swal.fire("Error", "No se pudo eliminar el restaurante", "error"),
        });
      }
    });
  }
}
