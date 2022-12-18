import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit, OnDestroy {

  isAdmin = true;

  isWriter = false;

  user: UserInterface | null = null;

  destroy$ = new Subject();

  constructor(
    private sharedService: SharedService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.sharedService.checkAdminRole(this.user).pipe(takeUntil(this.destroy$)).subscribe();      }
    });
    this.sharedService.isAdminRole$.pipe(takeUntil(this.destroy$)).subscribe((admin) => {
      if (this.user) {
        this.sharedService.checkAdminRole(this.user).pipe(takeUntil(this.destroy$)).subscribe((role) => this.isAdmin = role);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
