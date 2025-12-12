import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Orden } from "src/app/models/Orden";
import { OrdenService } from "src/app/services/orden.service";
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
  orden: Orden = { id: 0 };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ordenService: OrdenService
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
      this.orden.id = id;
      this.getOrden(id);
    }
  }

  configForm() {
    this.theFormGroup = this.fb.group({
      id: [{ value: "", disabled: true }],
      customer_id: ["", [Validators.required]],
      menu_id: ["", [Validators.required]],
      motorcycle_id: ["", [Validators.required]],
      quantity: [1, [Validators.required]],
      total_price: [0, [Validators.required]],
      status: ["", [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getOrden(id: number) {
    this.ordenService.view(id).subscribe((o) => {
      this.orden = o;
      this.theFormGroup.patchValue({
        id: o.id,
        customer_id: o.customer_id,
        menu_id: o.menu_id,
        motorcycle_id: o.motorcycle_id,
        quantity: o.quantity,
        total_price: o.total_price,
        status: o.status,
      });
    });
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Orden = {
      customer_id: this.theFormGroup.get("customer_id")?.value,
      menu_id: this.theFormGroup.get("menu_id")?.value,
      motorcycle_id: this.theFormGroup.get("motorcycle_id")?.value,
      quantity: this.theFormGroup.get("quantity")?.value,
      total_price: this.theFormGroup.get("total_price")?.value,
      status: this.theFormGroup.get("status")?.value,
    };
    this.ordenService.create(payload).subscribe(
      () => {
        Swal.fire("Creado", "Orden creada", "success");
        this.router.navigate(["/orden/list"]);
      },
      () => Swal.fire("Error", "No se creó", "error")
    );
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Orden = {
      id: this.orden.id,
      customer_id: this.theFormGroup.get("customer_id")?.value,
      menu_id: this.theFormGroup.get("menu_id")?.value,
      motorcycle_id: this.theFormGroup.get("motorcycle_id")?.value,
      quantity: this.theFormGroup.get("quantity")?.value,
      total_price: this.theFormGroup.get("total_price")?.value,
      status: this.theFormGroup.get("status")?.value,
    };
    this.ordenService.update(payload).subscribe(
      () => {
        Swal.fire("Actualizado", "Orden actualizada", "success");
        this.router.navigate(["/orden/list"]);
      },
      () => Swal.fire("Error", "No se actualizó", "error")
    );
  }

  back() {
    this.router.navigate(["/orden/list"]);
  }
}
