import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { title: 'Home', name: 'home' }
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home', name: 'home' }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
