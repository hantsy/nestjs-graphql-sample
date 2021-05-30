import { NgModule } from '@angular/core';

import { PostsRoutingModule } from './posts-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostFormComponent } from './shared/post-form/post-form.component';
import { PostService } from './shared/post.service';
import { PostDetailsResolve } from './shared/post-details-resolve';

@NgModule({
  declarations: [
    PostListComponent,
    PostDetailsComponent,
    NewPostComponent,
    EditPostComponent,
    PostFormComponent,
  ],
  imports: [SharedModule, PostsRoutingModule],
  providers: [PostService, PostDetailsResolve],
})
export class PostsModule {}
