import { Component, Input, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProductList } from '../../shared/interfaces/products.interface';
import { Navbar } from '../../navbar/navbar';
import { ProductService } from '../services/product';
import { ProductList } from '../../product/product-list';
import { Observable } from 'rxjs';
import { State } from '../services/state/state';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Navbar, ProductList, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit {
  protected readonly title = signal('fashion-store');

  @Input() data: IProductList[] = []

  products$!: Observable<IProductList[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  cartCount$!: Observable<number>;


  constructor(private router: Router, private productService: ProductService, private state: State) { }

  ngOnInit(): void {

    this.cartCount$ = this.state.cartCount$;
    this.products$ = this.state.products$;
    this.loading$ = this.state.loading$;
    this.error$ = this.state.error$;

    this.state.setLoading(true);
    this.productService.getAllProducts().subscribe({
      next: products => {
        this.state.setProducts(products);
        this.state.setLoading(false);
      },
      error: err => {
        this.state.setError(err);
        this.state.setLoading(false);
      }
    });
  }

  
  onProductSelected(product: IProductList): void {
    this.state.addToCart(product); 
  }

  onSearchApp(query: string): void {
    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();
      this.products$ = this.state.products$.pipe(
        map(products => products.filter(p => p.name.toLowerCase().includes(lowerQuery)))
      );
    } else {
      this.products$ = this.state.products$;
    }
  }

  onProductDetails(event: { productId: string; category: string }): void {
    this.router.navigate([`/product/${event.productId}/category/${event.category}`]);
  }

  createNewProduct() {
    this.router.navigate(['/products/new']);
  }
}