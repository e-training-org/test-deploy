// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ProductService } from '../services/product/product';
// import { CommonModule } from '@angular/common';
// import { State } from '../services/state/state';
// import { catchError, Observable } from 'rxjs';
// import { ErrorHandler } from '../services/error-handling/error-handler';

// @Component({
//   selector: 'app-product-form',
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './product-form.html',
//   styleUrls: ['./product-form.css'],
// })
// export class ProductForm implements OnInit {

//   productForm!: FormGroup;
//   imageError = false;

//   get loading$() {
//     return this.state.loading$;
//   }

//   get error$() {
//     return this.state.error$;
//   }

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private productService: ProductService,
//     private state: State,
//     private errorHandler: ErrorHandler
//   ) { }

//   ngOnInit(): void {
//     this.initForm();
//     this.listenToImageUrlChanges();
//   }

//   private initForm(): void {
//     this.productForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       description: ['', [Validators.required, Validators.minLength(10)]],
//       price: [null, [Validators.required, Validators.min(50)]],
//       category: ['', Validators.required],
//       image_url: ['', [
//         Validators.required,
//         Validators.pattern('https?://.+')
//       ]],
//       instock: [false],
//       rating: [0, [Validators.min(0), Validators.max(5)]],
//       properties: this.fb.array([this.createProperty()])
//     });
//   }

//   private listenToImageUrlChanges(): void {
//     this.productForm.get('image_url')?.valueChanges.subscribe(() => {
//       this.imageError = false;
//     });
//   }

//   createProperty(): FormGroup {
//     return this.fb.group({
//       color: ['', Validators.required],
//       weight: ['', Validators.required]
//     });
//   }

//   get properties(): FormArray {
//     return this.productForm.get('properties') as FormArray;
//   }

//   addProperty(): void {
//     this.properties.push(this.createProperty());
//   }

//   removeProperty(index: number): void {
//     if (this.properties.length > 1) {
//       this.properties.removeAt(index);
//     }
//   }

//   onSubmit(): void {
//     if (this.productForm.invalid) {
//       this.productForm.markAllAsTouched();
//       return;
//     }

//     this.state.setLoading(true);
//     this.state.setError(null);

//     const product = this.productForm.value;

//     this.productService.createProduct(product).pipe(
//       catchError(err => {
//         this.state.setLoading(false);
//         this.state.setError(err);
//         throw err;
//       })
//     ).subscribe({
//       next: (newProduct) => {
//         this.state.addProduct(newProduct);
//         this.state.setLoading(false);
//         this.productForm.reset();
//         this.properties.clear();
//         this.addProperty();
//         this.router.navigate(['']);
//       },
//       error: () => {
//       }
//     });
//   }

// }



import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product/product';
import { CommonModule } from '@angular/common';
import { State } from '../services/state/state';
import { catchError } from 'rxjs';
import { ErrorHandler } from '../services/error-handling/error-handler';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  imageError = false;

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
    private errorHandler: ErrorHandler
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenToImageUrlChanges();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(50)]],
      category: ['', Validators.required],
      image_url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      instock: [false],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      properties: this.fb.array([this.createProperty()])
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
      weight: ['', Validators.required]
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

    const raw = this.productForm.value;

    const product = {
      ...raw,
      price: Number(raw.price),
      rating: Number(raw.rating),
      instock: Boolean(raw.instock),
      properties: raw.properties?.map((p: any) => ({ key: p.color, value: p.weight })),
    };

    this.productService.createProduct(product).pipe(
      catchError(err => {
        this.state.setLoading(false);
        this.state.setError(err);
        throw err;
      })
    ).subscribe({
      next: (newProduct) => {
        this.state.addProduct(newProduct);
        this.state.setLoading(false);
        this.productForm.reset();
        this.properties.clear();
        this.addProperty();
        this.router.navigate(['']);
      },
      error: () => {}
    });
  }
}