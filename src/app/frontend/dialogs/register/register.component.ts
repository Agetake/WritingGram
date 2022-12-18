import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { counties } from 'src/assets/json/counties.data';
import { countries } from 'src/assets/json/countries.data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckCountyValidator, checkPhoneFormatValidator, createPasswordStrengthValidator, CustomConfirmPasswordValidator } from '../../classes/custom-form-validators';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { filter, shareReplay, Subject, take, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registrationType: string | null = null;

  loading = false;

  counties: {name: string; capital: string; code: number; }[] | [] = [];

  countries: {name: string; code: number; }[] | [] = [];

  filteredCounties: {name: string; capital: string; code: number; }[] | [] = [];

  registrationFormCountySearch: FormControl = new FormControl('');

  filteredCountries: {name: string; code: number; }[] | [] = [];

  registrationFormCountrySearch: FormControl = new FormControl('');

  ipAddress: string | null = null;

  destroy$ = new Subject();

  registrationForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, checkPhoneFormatValidator()]),
    county: new FormControl(''),
    country: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, createPasswordStrengthValidator()]),
    cPassword: new FormControl('', [Validators.required]),
  },
  [CustomConfirmPasswordValidator.MatchValidator('password', 'cPassword'), CheckCountyValidator.MatchValidator('county', 'country')]
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<RegisterComponent>,
    private http:HttpClient,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.registrationType = this.data.type;
    this.counties = counties as unknown as {name: string; capital: string; code: number; }[];
    this.countries = countries as unknown as {name: string; code: number; }[];
    this.filteredCounties = this.counties;
    this.filteredCountries = this.countries;
    this.getIPAddress();
  }

  registerUser() {
    this.loading = true;
    const password = this.registrationForm.value.password;
    let userId = '';
    const userType = this.registrationType ? this.registrationType : 'customer';
    let user: UserInterface = {
      id: userId,
      name: this.registrationForm.value.name,
      email: (this.registrationForm.value.email).toLowerCase(),
      phone: this.registrationForm.value.phone,
      country: this.registrationForm.value.country,
      county: this.registrationForm.value.county,
      createdAt: new Date().toISOString(),
      papers: [],
      active: true,
      confirmed: false,
      approved: false,
      username: this.registrationForm.value.email,
      roles: [userType],
      lastLoginIp: this.ipAddress ? this.ipAddress : 'N/A',
      type: userType as unknown as UserInterface['type'],
      registrationComplete: false,
    }
    if (userType == 'customer') {
      const paperId = this.sharedService.generateUniqueId(this.registrationForm.value.name);
      const paper =  {
        id: paperId,
        name: '',
        description: '',
        county: null,
        active: false,
      }
      user.papers = [paper.id];
      // user.packageId = this.data.packageId;
    }
    this.userService.getUserById(this.registrationForm.value.email).pipe(filter(res => res !== null || res !== undefined), shareReplay(1), take(1))
    .subscribe((existingUser) => {
      if (existingUser) {
        userId = existingUser.email;
      } else {
        userId = (this.registrationForm.value.email).toLowerCase();
      }
      user.id = userId;
      this.userService.SignUp(user, password)
      .then(() => {
        this.loading = false;
        this.dialogRef.close();
        this.snackBar.open('Success Registering', '', {
          duration: 2000
        });
        if (userType == 'customer') {
          this.router.navigate(['/']);
          return;
        }
        this.router.navigateByUrl('/complete-registration');
      })
      .catch((err) => {
        // log error to cloud
        this.loading = false;
        this.dialogRef.close();
        this.snackBar.open('Error Registering', '', {
          duration: 2000
        });
      })
    });
  }

  get passwordMatchError() {
    return (
      this.registrationForm.getError('mismatch')
    );
  }

  get countyInvalidError() {
    return (
      this.registrationForm.getError('countyValid')
    );
  }

  get country() {
    return (
      this.registrationForm.value.country
    );
  }


  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }

  onCountyKey() {
    if (this.registrationFormCountySearch.value.length > 0) {
      this.filteredCounties = this.filteredCounties.filter((county: { name:string; code: number; capital: string; }) =>
      county.name.toLowerCase().includes(this.registrationFormCountySearch.value.toLowerCase())
    );
    } else {
      this.filteredCounties = this.counties;
    }
  }

  onCountryKey() {
    if (this.registrationFormCountrySearch.value.length > 0) {
      this.filteredCountries = this.filteredCountries.filter((country: { name:string; code: number; }) =>
      country.name.toLowerCase().includes(this.registrationFormCountrySearch.value.toLowerCase())
    );
    } else {
      this.filteredCountries = this.countries;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
