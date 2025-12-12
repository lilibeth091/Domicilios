import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Moto } from "src/app/models/Moto";
import { MotoService } from "src/app/services/moto.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode = 1;
  theFormGroup!: FormGroup;
  trySend = false;
  moto: Moto = { id: 0 };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private motoService: MotoService
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
      this.moto.id = id;
      this.getMoto(id);
    }
  }

  configForm() {
    this.theFormGroup = this.fb.group({
      id: [{ value: "", disabled: true }],
      license_plate: ["", [Validators.required]],
      brand: ["", [Validators.required]],
      year: [null, [Validators.required]],
      status: ["", [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getMoto(id: number) {
    this.motoService.view(id).subscribe((m) => {
      this.moto = m;
      this.theFormGroup.patchValue({
        id: m.id,
        license_plate: m.license_plate,
        brand: m.brand,
        year: m.year,
        status: m.status,
      });
    });
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Moto = {
      license_plate: this.theFormGroup.get("license_plate")?.value,
      brand: this.theFormGroup.get("brand")?.value,
      year: this.theFormGroup.get("year")?.value,
      status: this.theFormGroup.get("status")?.value,
    };
    this.motoService.create(payload).subscribe(
      () => {
        Swal.fire("Creado", "Moto creada", "success");
        this.router.navigate(["/moto/list"]);
      },
      () => Swal.fire("Error", "No se creó", "error")
    );
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Moto = {
      id: this.moto.id,
      license_plate: this.theFormGroup.get("license_plate")?.value,
      brand: this.theFormGroup.get("brand")?.value,
      year: this.theFormGroup.get("year")?.value,
      status: this.theFormGroup.get("status")?.value,
    };
    this.motoService.update(payload).subscribe(
      () => {
        Swal.fire("Actualizado", "Moto actualizada", "success");
        this.router.navigate(["/moto/list"]);
      },
      () => Swal.fire("Error", "No se actualizó", "error")
    );
  }

  back() {
    this.router.navigate(["/moto/list"]);
  }
}
