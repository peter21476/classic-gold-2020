import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DjsComponent  } from './djs/djs.component';
import { HeadlinesComponent  } from './headlines/headlines.component';
import { ContactComponent  } from './contact/contact.component';


const routes: Routes = [
  { path:'home', component: HomeComponent },
  { path:'djs', component: DjsComponent  },
  { path:'headlines', component: HeadlinesComponent },
  { path:'contact', component: ContactComponent },
  { path:'', redirectTo:'home', pathMatch:'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
