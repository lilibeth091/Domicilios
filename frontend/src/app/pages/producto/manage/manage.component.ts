import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Producto } from "src/app/models/Producto";
import { ProductoService } from "src/app/services/producto.service";
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
  producto: Producto = { id: 0 };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
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
      this.producto.id = id;
      this.getProducto(id);
    }
  }

  configForm() {
    this.theFormGroup = this.fb.group({
      id: [{ value: "", disabled: true }],
      name: ["", [Validators.required]],
      description: ["", []],
      price: [0, [Validators.required]],
      category: ["", []],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getProducto(id: number) {
    this.productoService.view(id).subscribe((p) => {
      this.producto = p;
      this.theFormGroup.patchValue({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
      });
    });
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Producto = {
      name: this.theFormGroup.get("name")?.value,
      description: this.theFormGroup.get("description")?.value,
      price: this.theFormGroup.get("price")?.value,
      category: this.theFormGroup.get("category")?.value,
    };
    this.productoService.create(payload).subscribe(
      () => {
        Swal.fire("Creado", "Producto creado", "success");
        this.router.navigate(["/producto/list"]);
      },
      () => Swal.fire("Error", "No se creó", "error")
    );
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Producto = {
      id: this.producto.id,
      name: this.theFormGroup.get("name")?.value,
      description: this.theFormGroup.get("description")?.value,
      price: this.theFormGroup.get("price")?.value,
      category: this.theFormGroup.get("category")?.value,
    };
    this.productoService.update(payload).subscribe(
      () => {
        Swal.fire("Actualizado", "Producto actualizado", "success");
        this.router.navigate(["/producto/list"]);
      },
      () => Swal.fire("Error", "No se actualizó", "error")
    );
  }

  back() {
    this.router.navigate(["/producto/list"]);
  }
}
