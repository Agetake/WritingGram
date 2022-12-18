import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subject, takeUntil, take, retry } from 'rxjs';
import { counties } from 'src/assets/json/counties.data';
import { countries } from 'src/assets/json/countries.data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit, OnDestroy {
  user: UserInterface | null = null;

  destroy$ = new Subject();

  counties = counties;

  countries = countries;

  isAdmin = true;

  constructor(
    private userService: UserService,
    @Optional() public dialogRef: MatDialogRef<ViewUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data:any,
    private firebaseFns: AngularFireFunctions,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.user) {
      this.user = this.data.user;
    } else {
      this.userService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });
    }
    if (this.user) {
      this.sharedService.checkAdminRole(this.user).pipe(takeUntil(this.destroy$)).subscribe((role) => this.isAdmin = role);
    }
  }

  editProfile(){

  }

  getCounty(code: string) {
    return (this.counties.filter((county) => county.code === code as unknown as number))[0].name;
  }

  getCountry(code: string) {
    return (this.countries.filter((country) => country.code === code))[0].name;
  }

  makeAdmin(user: UserInterface) {
    const firebaseFN = this.firebaseFns.httpsCallable('callableFn-addCustomClaim');
    firebaseFN(user.firebaseUid).pipe(
      retry({ count: 5, delay: 2000 }),
    ).subscribe(() => {
      this.sharedService.checkAdminRole(user).subscribe((role) => {
        this.isAdmin = role;
        const newUser = user;
        if (newUser.roles?.indexOf('admin') === -1) {
          newUser.roles.push('admin');
        }
        this.userService.updateUserInFirebase(newUser)
        .then()
        .catch((err) => console.log(err));
      });
    });
  }

  revokeAdminRole(user: UserInterface) {
    const firebaseFN = this.firebaseFns.httpsCallable('callableFn-removeCustomClaim');
    firebaseFN(user.firebaseUid).pipe(
      retry({ count: 5, delay: 2000 }),
    ).subscribe(() => {
      this.sharedService.checkAdminRole(user).subscribe((role) => {
        this.isAdmin = role;
        let newUser = user;
        newUser.roles = newUser.roles ? newUser.roles.filter((value) => value !== 'admin') : [];
        this.userService.updateUserInFirebase(newUser)
        .then()
        .catch((err) => console.log(err));
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}

