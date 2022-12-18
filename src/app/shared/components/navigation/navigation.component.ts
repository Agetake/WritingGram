import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaperService } from '../../services/paper/paper.service';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user/user.service';
import { startWith, takeUntil, Subject, Observable, distinctUntilChanged, debounceTime, take, filter, tap } from 'rxjs';
import { UserInterface } from '../../interfaces/user.interface';
import { RegisterComponent } from 'src/app/frontend/dialogs/register/register.component';
import { LoginComponent } from 'src/app/frontend/dialogs/login/login.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  cartlistnavbar:any=[];

  cartlistnavbar_totalprice:any=0;

  selectedModal = '';

  showModal = false;

  destroy$ = new Subject();

  cartItemsCount = 0;

  user: UserInterface | null = null;

  constructor(
    private paperService:PaperService,
    private router:Router,
    private dialog: MatDialog,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public sharedService: SharedService,
    private aFAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.sharedService.cartContent$.pipe(startWith(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') as unknown as string) : []), takeUntil(this.destroy$)).subscribe((cartContents) => {
      if (cartContents) {
        this.cartItemsCount = cartContents.length;
      }
    });
    this.aFAuth.onAuthStateChanged((user) => {
      this.user = user as unknown as UserInterface | null;
    });
  }

  registerWriter() {
    const dialogData = {
      type: 'writer',
    };
    const dialogRef: MatDialogRef<RegisterComponent> = this.dialog.open(RegisterComponent, {
      width: '80vw',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe();
  }

  registerCustomer() {
    const dialogData = {
      type: 'customer',
    };
    const dialogRef: MatDialogRef<RegisterComponent> = this.dialog.open(RegisterComponent, {
      width: '80vw',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe();
  }

  showLogin() {
    localStorage.removeItem('redirectUrl');
    this.router.url == '/home' ? localStorage.setItem('redirectUrl', '/dashboard') : localStorage.setItem('redirectUrl', this.router.url);
    const dialogRef: MatDialogRef<LoginComponent> = this.dialog.open(LoginComponent, {
      width: '60vw',
    });
    dialogRef.afterClosed().subscribe();
  }
}
