import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, take, takeUntil } from 'rxjs';
import { FileUploadComponent } from 'src/app/shared/dialogs/file-upload/file-upload.component';
import { UploadedFileInterface } from 'src/app/shared/interfaces/file.interface';
import { LevelInterface } from 'src/app/shared/interfaces/level.interface';
import { PaperDisciplineInterface } from 'src/app/shared/interfaces/paper-discipline.interface';
import { PaperTypeInterface } from 'src/app/shared/interfaces/paper-type.interface';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { DisciplineService } from 'src/app/shared/services/discipline/discipline.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-complete-writer-registration',
  templateUrl: './complete-writer-registration.component.html',
  styleUrls: ['./complete-writer-registration.component.scss']
})
export class CompleteWriterRegistrationComponent implements OnInit {
  paperTypes: PaperTypeInterface[] = [];

  levels: LevelInterface[] = [];

  disciplines: PaperDisciplineInterface[] = [];

  destroy$ = new Subject();

  paperFormats = ['APA', 'MLA', 'Chicago/Turabian', 'Harvard', 'OSCOLA'];

  user: UserInterface | null = null;

  fileId: string | null = null;

  yearsArr: number[] = [];

  registrationComplete = false;

  samplePaperUploaded = false;

  registrationForm: FormGroup = new FormGroup({
    educationLevel: new FormControl({ value: 'Undergraduate', disabled: false}, Validators.required),
    discipline: new FormControl({value: [11], disabled: false}, Validators.required),
    format: new FormControl({value: ['APA'], disabled: false}, Validators.required),
    institution: new FormControl('', Validators.required),
    year: new FormControl({value: 2021, disabled: false}, Validators.required),
  });

  fileDetails: UploadedFileInterface[] | null = null;

  filePath = 'essays/sample-essays';

  constructor(
    private disciplineService: DisciplineService,
    private userService: UserService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.yearsArr = this.generateYearsArr(new Date().getFullYear() - 20);
    this.disciplineService.getDisciplines().pipe(takeUntil(this.destroy$)).subscribe((disciplines) => {
      if (disciplines) {
        this.disciplines = disciplines;
      }
    });
    this.userService.getCurrentUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
        if (user.registrationComplete) {
          this.registrationComplete = true;
        }
        this.fileId = this.sharedService.generateUniqueId(`${this.user.name}`);
      }
    });
  }

  completeRegistration() {
    if (this.registrationForm.valid && this.user) {
      const educationLevel = this.registrationForm.value.educationLevel;
      const disciplines = this.registrationForm.value.discipline;
      const format = this.registrationForm.value.format;
      const year = this.registrationForm.value.year;
      const institution = this.registrationForm.value.institution;
      let selectedDisciplines = disciplines.map((selectedDiscipline: number) => this.disciplines.find((discipline) => discipline.code === selectedDiscipline));
      const newUser: UserInterface = this.user;
      newUser.writingStyles = format;
      newUser.education = [{
        certificate: educationLevel,
        year: year,
        school: institution
      }];
      newUser.preferredDisciplines = selectedDisciplines;
      newUser.registrationComplete = true;
      this.userService.updateUserInFirebase(newUser).then(() => {
        this.snackBar.open('Success Registering', '', {
          duration: 2000
        });
        if (newUser.samplePapers && newUser.samplePapers.length) {
          this.registrationComplete = true;
        }
      })
      .catch((err) => console.log(err));
    }
  }

  uploadedFileDetails(uploadedFiles: UploadedFileInterface[]) {
    if (uploadedFiles && uploadedFiles.length > 0 && this.user) {
      this.fileDetails = uploadedFiles;
      uploadedFiles.forEach((uploadedFile) => {
        const samplePaper = {
          paperId: uploadedFile.id,
          downloadUrl: uploadedFile.downloadUrl,
        };
        this.user && (!this.user?.samplePapers || !this.user.samplePapers.length) ? this.user.samplePapers = [samplePaper] : this.user?.samplePapers?.push(samplePaper);
        this.samplePaperUploaded = true;
      });
    }
  }

  generateYearsArr(startYear: number) {
    var currentYear = new Date().getFullYear(), years = [];
    startYear = startYear || 1980;
    while ( startYear <= currentYear ) {
        years.push(startYear++);
    }
    return years;
  }

}
