import { Component, OnInit } from "@angular/core";
import { Moto } from "src/app/models/Moto";
import { MotoService } from "src/app/services/moto.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  motos: Moto[] = [];

  constructor(private motoService: MotoService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.motoService.list().subscribe((data) => (this.motos = data || []));
  }

  create() {
    this.router.navigate(["/moto/create"]);
  }
  view(id: number) {
    this.router.navigate(["/moto/view", id]);
  }
  edit(id: number) {
    this.router.navigate(["/moto/update", id]);
  }

  delete(id: number) {
    Swal.fire({ title: "¿Eliminar?", showCancelButton: true }).then((res) => {
      if (res.isConfirmed)
        this.motoService.delete(id).subscribe(
          () => {
            Swal.fire("Eliminado", "OK", "success");
            this.load();
          },
          () => Swal.fire("Error", "No se eliminó", "error")
        );
    });
  }
}
