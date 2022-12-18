import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loading = false;

  constructor(
    private aFAuth: AngularFireAuth,
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
   }

  ngOnInit(): void {
  }

  async onSubmit() {
    this.loading = true;
    const { email } = this.form.value;
    const { password } = this.form.value;
    this.aFAuth.signInWithEmailAndPassword(email, password)
    .then(() => {
      this.loading = false;
      this.dialogRef.close();
      const redirectUrl = localStorage.getItem('redirectUrl') ? localStorage.getItem('redirectUrl') : '/dashboard';
      this.router.navigate([redirectUrl]);
      this.snackBar.open('Success Signing In', '', {
        duration: 2000
      });
    })
    .catch((err) => {
      this.dialogRef.close();
      this.snackBar.open('Error Signing In', '', {
        duration: 2000
      });
    });
  }

  signUp() {
    this.dialogRef.close();
    const dialogData = {
      type: 'customer',
    };
    const dialogRef: MatDialogRef<RegisterComponent> = this.dialog.open(RegisterComponent, {
      width: '80vw',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe();
  }

  forgotPassword() {

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
