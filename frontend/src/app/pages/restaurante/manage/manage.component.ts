import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Restaurante } from "src/app/models/Restaurante";
import { RestauranteService } from "src/app/services/restaurante.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode: number; // 1: View, 2: Create, 3: Update
  theFormGroup: FormGroup;
  trySend: boolean;
  restaurante: Restaurante;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restauranteService: RestauranteService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.mode = 1;
    this.trySend = false;
    this.restaurante = { id: 0 };
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join("/");
    if (currentUrl.includes("view")) {
      this.mode = 1;
    } else if (currentUrl.includes("create")) {
      this.mode = 2;
    } else if (currentUrl.includes("update")) {
      this.mode = 3;
    }
    if (this.activatedRoute.snapshot.params.id) {
      this.restaurante.id = this.activatedRoute.snapshot.params.id;
      this.getRestaurante(this.restaurante.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getRestaurante(id: number) {
    this.restauranteService.view(id).subscribe((data) => {
      this.restaurante = data;
      this.theFormGroup.patchValue({
        id: this.restaurante.id,
        nombre: this.restaurante.name,
        direccion: this.restaurante.address,
        telefono: this.restaurante.phone,
        capacidad: this.restaurante.email
      });
    });
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos correctamente",
      });
      return;
    }
    const newRestaurante: Restaurante = {
      name: this.theFormGroup.get('nombre')?.value,
      address: this.theFormGroup.get('direccion')?.value,
      phone: this.theFormGroup.get('telefono')?.value,
      email: this.theFormGroup.get('capacidad')?.value
    };
    this.restauranteService.create(newRestaurante).subscribe({
      next: (data) => {
        Swal.fire({
          icon: "success",
          title: "Creado",
          text: "Restaurante creado exitosamente",
        });
        this.router.navigate(["/restaurante/list"]);
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el restaurante",
        });
      },
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos correctamente",
      });
      return;
    }
    const updatedRestaurante: Restaurante = {
      id: this.restaurante.id,
      name: this.theFormGroup.get('nombre')?.value,
      address: this.theFormGroup.get('direccion')?.value,
      phone: this.theFormGroup.get('telefono')?.value,
      email: this.theFormGroup.get('capacidad')?.value
    };
    this.restauranteService.update(updatedRestaurante).subscribe({
      next: (data) => {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Restaurante actualizado exitosamente",
        });
        this.router.navigate(["/restaurante/list"]);
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el restaurante",
        });
      },
    });
  }

  back() {
    this.router.navigate(["/restaurante/list"]);
  }
}
