import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../shared/post.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit, OnDestroy {
  post: Post = { title: '', content: '' };

  constructor(private router: Router, private route: ActivatedRoute) {}

  onPostUpdated(event: any) {
    console.log('post was updated:' + JSON.stringify(event));
    if (event) {
      this.router.navigateByUrl('/posts');
    }
  }

  ngOnInit() {
    this.post = this.route.snapshot.data['post'];
  }

  ngOnDestroy() {}
}
