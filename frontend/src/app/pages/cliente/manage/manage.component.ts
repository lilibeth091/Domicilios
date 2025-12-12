import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Cliente } from "src/app/models/Cliente";
import { ClienteService } from "src/app/services/cliente.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode = 1; // 1:view,2:create,3:update
  theFormGroup!: FormGroup;
  trySend = false;
  cliente: Cliente = { id: 0 };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {
    this.configForm();
  }

  ngOnInit(): void {
    const url = this.route.snapshot.url.join("/");
    if (url.includes("create")) this.mode = 2;
    else if (url.includes("update")) this.mode = 3;
    else this.mode = 1;

    const id = this.route.snapshot.params.id;
    if (id) {
      this.cliente.id = id;
      this.getCliente(id);
    }
  }

  configForm() {
    this.theFormGroup = this.fb.group({
      id: [{ value: "", disabled: true }],
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getCliente(id: number) {
    this.clienteService.view(id).subscribe((c) => {
      this.cliente = c;
      this.theFormGroup.patchValue({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
      });
    });
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Cliente = {
      name: this.theFormGroup.get("name")?.value,
      email: this.theFormGroup.get("email")?.value,
      phone: this.theFormGroup.get("phone")?.value,
    };
    this.clienteService.create(payload).subscribe(
      () => {
        Swal.fire("Creado", "Cliente creado", "success");
        this.router.navigate(["/cliente/list"]);
      },
      () => Swal.fire("Error", "No se pudo crear", "error")
    );
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Cliente = {
      id: this.cliente.id,
      name: this.theFormGroup.get("name")?.value,
      email: this.theFormGroup.get("email")?.value,
      phone: this.theFormGroup.get("phone")?.value,
    };
    this.clienteService.update(payload).subscribe(
      () => {
        Swal.fire("Actualizado", "Cliente actualizado", "success");
        this.router.navigate(["/cliente/list"]);
      },
      () => Swal.fire("Error", "No se pudo actualizar", "error")
    );
  }

  back() {
    this.router.navigate(["/cliente/list"]);
  }
}
