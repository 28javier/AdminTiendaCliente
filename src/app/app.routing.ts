import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { AuthGuard } from './guard/auth.guard';
import { IndexProductsComponent } from './components/products/index-products/index-products.component';


const appRoter: Routes = [

    { path: '', component: InicioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cuenta/perfil', component: PerfilComponent, canActivate: [AuthGuard] },
    { path: 'productos', component: IndexProductsComponent },
    { path: 'productos/categoria/:categoria', component: IndexProductsComponent }


]

export const appRoutingProviders: any[] = [];
export const routingModule: ModuleWithProviders<any> = RouterModule.forRoot(appRoter);
