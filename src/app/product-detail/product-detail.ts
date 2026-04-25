import { Component, OnInit, signal, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../services/product';
import { IProductList } from '../../shared/interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { CartService } from '../services/cart/cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetail implements OnInit {
  cartCounter$!: Observable<number>; 
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    private productService: ProductService, 
    private router: ActivatedRoute,
    private routerService: Router,
    private ngZone: NgZone,
    private cartService: CartService
  ) { }
  productId: string | null = null;
  category: string | null = null;
  selectedProduct = signal<IProductList | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.productId = this.router.snapshot.paramMap.get('id');
    this.category = this.router.snapshot.paramMap.get('name');
    
    if (this.productId) {
      this.getProductDetails();
    }
    
    this.router.paramMap.subscribe(params => {
      const newId = params.get('id');
      if (newId && newId !== this.productId) {
        this.productId = newId;
        this.getProductDetails();
      }
    });
  }

  getProductDetails(): void {
    if (this.productId) {
      this.ngZone.run(() => {
        this.isLoading.set(true);
      });
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.ngZone.run(() => {
            this.selectedProduct.set(product);
            this.isLoading.set(false);
          });
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.ngZone.run(() => {
            this.isLoading.set(false);
          });
        }
      });
    } else {
      console.error('No product ID found in route');
      this.isLoading.set(false);
    }
  }

  addToCart() {
    const product = this.selectedProduct();  
    if (product) {
      this.cartService.addToCart(product);
      this.routerService.navigate(['/cart']);
    }
    
  }

  goBack(): void {
    this.routerService.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.routerService.navigate(['/']);
    });
  }
}
