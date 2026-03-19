import { Routes } from '@angular/router';
import { authGuard } from './auth-guard'

export const routes: Routes = [
    { path: '', 
        canActivate: [authGuard],
        loadComponent: () => import('./home/home').then(m => m.Home)
     },
    { path: 'product/:id/category/:name', 
        canActivate: [authGuard],
        loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetail)
    },
    { path: 'cart', 
        canActivate: [authGuard], 
        loadComponent: () => import('./cart/cart').then(m => m.Cart) },
    { path: 'products/new', 
        canActivate: [authGuard], 
        loadComponent: () => import('./product-form/product-form').then(m => m.ProductForm) 
    },
    { path: 'login', 
        loadComponent: () => import('./login/login').then(m => m.Login) 
    },
     { path: 'signup', 
        loadComponent: () => import('./sign-up/sign-up').then(m => m.Signup) 
    },
    { path: '**', 
        loadComponent: () => import('./notfound/notfound').then(m => m.Notfound) 
    }
];
