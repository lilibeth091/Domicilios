import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Menu } from "src/app/models/Menu";
import { MenuService } from "src/app/services/menu.service";
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
  menu: Menu = { id: 0 };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
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
      this.menu.id = id;
      this.getMenu(id);
    }
  }

  configForm() {
    this.theFormGroup = this.fb.group({
      id: [{ value: "", disabled: true }],
      restaurant_id: ["", [Validators.required]],
      product_id: ["", [Validators.required]],
      price: [0, [Validators.required]],
      availability: [true],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getMenu(id: number) {
    this.menuService.view(id).subscribe((m) => {
      this.menu = m;
      this.theFormGroup.patchValue({
        id: m.id,
        restaurant_id: m.restaurant_id,
        product_id: m.product_id,
        price: m.price,
        availability: m.availability,
      });
    });
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Menu = {
      restaurant_id: this.theFormGroup.get("restaurant_id")?.value,
      product_id: this.theFormGroup.get("product_id")?.value,
      price: this.theFormGroup.get("price")?.value,
      availability: this.theFormGroup.get("availability")?.value,
    };
    this.menuService.create(payload).subscribe(
      () => {
        Swal.fire("Creado", "Menú creado", "success");
        this.router.navigate(["/menu/list"]);
      },
      () => Swal.fire("Error", "No se creó", "error")
    );
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid)
      return Swal.fire("Error", "Complete los campos", "error");
    const payload: Menu = {
      id: this.menu.id,
      restaurant_id: this.theFormGroup.get("restaurant_id")?.value,
      product_id: this.theFormGroup.get("product_id")?.value,
      price: this.theFormGroup.get("price")?.value,
      availability: this.theFormGroup.get("availability")?.value,
    };
    this.menuService.update(payload).subscribe(
      () => {
        Swal.fire("Actualizado", "Menú actualizado", "success");
        this.router.navigate(["/menu/list"]);
      },
      () => Swal.fire("Error", "No se actualizó", "error")
    );
  }

  back() {
    this.router.navigate(["/menu/list"]);
  }
}
