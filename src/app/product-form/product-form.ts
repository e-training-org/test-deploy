import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product';
import { CommonModule } from '@angular/common';
import { State } from '../services/state/state';
import { catchError } from 'rxjs';
import { ErrorHandler } from '../services/error-handling/error-handler';
import { CategoryComponent } from '../category/category';
import { CategoryService } from '../services/category';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule, CategoryComponent],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  imageError = false;
  categories: any[] = [];

  get loading$() {
    return this.state.loading$;
  }

  get error$() {
    return this.state.error$;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private state: State,
    private errorHandler: ErrorHandler,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenToImageUrlChanges();
    this.categoryDropdown();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(50)]],
      categoryId: [null, Validators.required],
      image_url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      instock: [false],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      properties: this.fb.array([this.createProperty()]),
    });
  }

  categoryDropdown() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  private listenToImageUrlChanges(): void {
    this.productForm.get('image_url')?.valueChanges.subscribe(() => {
      this.imageError = false;
    });
  }

  createProperty(): FormGroup {
    return this.fb.group({
      color: ['', Validators.required],
      weight: ['', Validators.required],
    });
  }

  get properties(): FormArray {
    return this.productForm.get('properties') as FormArray;
  }

  addProperty(): void {
    this.properties.push(this.createProperty());
  }

  removeProperty(index: number): void {
    if (this.properties.length > 1) {
      this.properties.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.state.setLoading(true);
    this.state.setError(null);

    const raw: any = this.productForm.getRawValue();

    const product = {
      ...raw,
      price: Number(raw.price),
      categoryId: Number(raw.categoryId),
      rating: Number(raw.rating),
      instock: Boolean(raw.instock),
      properties: raw.properties?.map((p: any) => ({ key: p.color, value: p.weight })),
    };

    this.productService
      .createProduct(product)
      .pipe(
        catchError((err) => {
          this.state.setLoading(false);
          this.state.setError(err?.error?.message || 'Something went wrong');
          return [];
        }),
      )
      .subscribe({
        next: (newProduct) => {
          this.state.addProduct(newProduct);
          this.state.setLoading(false);
          this.productForm.reset();
          this.properties.clear();
          this.addProperty();
          this.router.navigate(['']);
        },
        error: () => {},
      });
  }
}
