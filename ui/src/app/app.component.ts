import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Apollo, gql } from 'apollo-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(public apollo: Apollo, public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      if (authenticated) {
        const syncUserInfo = gql`
          mutation {
            updateUser {
              success
            }
          }
        `;
        this.apollo
          .mutate({
            mutation: syncUserInfo,
          })
          .subscribe(({ data }) => {
            console.log('done refreshed user info:', data);
          });
      }
    });
  }
}
