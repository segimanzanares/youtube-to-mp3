import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { TagEditorComponent } from './views/tag-editor/tag-editor.component';

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
    },
    {
        path: 'tageditor',
        component: TagEditorComponent,
        data: { title: 'Id3 Tag Editor', name: 'tageditor' }
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
