import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostDetailsComponent } from './post-details/post-details.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailsResolve } from './shared/post-details-resolve';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'new', component: NewPostComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:id',
    component: EditPostComponent,
    canActivate: [AuthGuard],
    resolve: {
      post: PostDetailsResolve,
    },
  },
  { path: 'view/:id', component: PostDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
