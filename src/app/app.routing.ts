import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { AuthGuard } from './guard/auth.guard';
import { IndexProductsComponent } from './components/products/index-products/index-products.component';
import { ShowProductComponent } from './components/products/show-product/show-product.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';


const appRoter: Routes = [

    { path: '', component: InicioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cuenta/perfil', component: PerfilComponent, canActivate: [AuthGuard] },
    { path: 'cuenta/direcciones', component: DireccionesComponent, canActivate: [AuthGuard] },
    { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },


    { path: 'productos', component: IndexProductsComponent },
    { path: 'productos/categoria/:categoria', component: IndexProductsComponent },
    { path: 'productos/:slug', component: ShowProductComponent },


]

export const appRoutingProviders: any[] = [];
export const routingModule: ModuleWithProviders<any> = RouterModule.forRoot(appRoter);
