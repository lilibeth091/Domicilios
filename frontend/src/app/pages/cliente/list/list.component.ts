import { Component, OnInit } from "@angular/core";
import { Cliente } from "src/app/models/Cliente";
import { ClienteService } from "src/app/services/cliente.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.clienteService
      .list()
      .subscribe((data) => (this.clientes = data || []));
  }

  create() {
    this.router.navigate(["/cliente/create"]);
  }
  view(id: number) {
    this.router.navigate(["/cliente/view", id]);
  }
  edit(id: number) {
    this.router.navigate(["/cliente/update", id]);
  }

  delete(id: number) {
    Swal.fire({ title: "¿Eliminar?", showCancelButton: true }).then((res) => {
      if (res.isConfirmed) {
        this.clienteService.delete(id).subscribe(
          () => {
            Swal.fire("Eliminado", "OK", "success");
            this.load();
          },
          () => Swal.fire("Error", "No se eliminó", "error")
        );
      }
    });
  }
}
