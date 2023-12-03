import {Component, OnDestroy} from '@angular/core';
import {AuthService} from "./user/auth.service";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import {MessageService} from "./messages/message.service";
import {slideInAnimation} from "./app.animation";
import {Subscription} from "rxjs";


@Component({
  selector: 'ms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnDestroy {
  title: string = 'Paper Shop - stationery store';
  loading = true;

  sub: Subscription;
  constructor(private authService: AuthService,
              private router: Router,
              private messageService: MessageService) {

    this.sub = router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });

  }

  ngOnDestroy(): void {
       this.sub.unsubscribe();
    }
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }


  get isMessageDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }


  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  displayMessages(): void {
    // Example of primary and secondary routing together
    // this.router.navigate(['/login', {outlets: { popup: ['messages']}}]); // Does not work
    // this.router.navigate([{outlets: { primary: ['login'], popup: ['messages']}}]); // Works
    this.router.navigate([{ outlets: { popup: ['messages'] } }]); // Works
    this.messageService.isDisplayed = true;
  }

  hideMessages(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
    this.messageService.isDisplayed = false;
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/welcome');
  }
}
