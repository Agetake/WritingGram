import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { user } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, take, debounceTime } from 'rxjs';
import { FileUpload } from 'src/app/shared/classes/file-upload';
import { FileInterface } from 'src/app/shared/interfaces/file.interface';
import { LevelInterface } from 'src/app/shared/interfaces/level.interface';
import { PaperDisciplineInterface } from 'src/app/shared/interfaces/paper-discipline.interface';
import { PaperTypeInterface } from 'src/app/shared/interfaces/paper-type.interface';
import { PaperInterface } from 'src/app/shared/interfaces/paper.interface';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { DisciplineService } from 'src/app/shared/services/discipline/discipline.service';
import { UploadFilesService } from 'src/app/shared/services/file/upload-files.service';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { PaperTypeService } from 'src/app/shared/services/paper-type/paper-type.service';
import { PaperService } from 'src/app/shared/services/paper/paper.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { WriterProfileComponent } from '../writer-profile/writer-profile.component';

@Component({
  selector: 'app-view-paper',
  templateUrl: './view-paper.component.html',
  styleUrls: ['./view-paper.component.scss']
})
export class ViewPaperComponent implements OnInit, OnDestroy {

  paper: PaperInterface | null = null;

  assigned: boolean = false;

  writers: UserInterface[] = [];

  writer: FormControl = new FormControl({value: 'default', disabled: false}, Validators.required);

  selectedWriter: UserInterface | null = null;

  assignedWriter: UserInterface | null = null;

  destroy$ = new Subject();

  myOrder: boolean = false;

  paperTypes: PaperTypeInterface[] = [];

  levels: LevelInterface[] = [];

  disciplines: PaperDisciplineInterface[] = [];

  fileDetails: {id: string, name: string, downloadUrl: string, type: string, uploadedBy: UserInterface, approved: boolean, uploadedOn: string}[] | null = null;

  completionStatus: FormControl = new FormControl({value: 'complete', disabled: false});

  completedPages: FormControl = new FormControl({value: 1, disabled: false});

  user: UserInterface | null = null;

  comment: FormControl = new FormControl('', Validators.required);

  //ToDO: change this to false
  isAdmin = true;

  fileApproved = false;

  constructor(
    @Optional() public dialogRef: MatDialogRef<ViewPaperComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data:any,
    private userService: UserService,
    private dialog: MatDialog,
    private paperService: PaperService,
    private snackBar: MatSnackBar,
    private paperTypeService: PaperTypeService,
    private levelService: LevelService,
    private disciplineService: DisciplineService,
    private uploadFileService: UploadFilesService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.completionStatus.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((status) => {
      if (status === 'partial') {

      }
      if (status === 'complete' && this.paper && this.paper.files) {
        if (this.paper.files.find((file) => file.approved)) {
          this.paper.completionStatus = 'complete';
          this.paperService.update(this.paper).then().catch((err) => console.log(err));
          return;
        }
        this.snackBar.open('At least one file must be approved before marking the paper as complete', '', {
          duration: 2000
        });
        this.completionStatus.setValue('partial');
      }
    });
    this.levelService.getLevels().pipe(takeUntil(this.destroy$)).subscribe((levels) => {
      if (levels) {
        this.levels = levels;
      }
    });
    this.paperTypeService.getPaperTypes().pipe(takeUntil(this.destroy$)).subscribe((types) => {
      if (types) {
        this.paperTypes = types;
      }
    });
    this.disciplineService.getDisciplines().pipe(takeUntil(this.destroy$)).subscribe((disciplines) => {
      if (disciplines) {
        this.disciplines = disciplines;
      }
    });
    this.paper = this.data.paper;
    if (this.paper && this.paper.files && this.paper.files.find((file) => file.approved)) {
      this.fileApproved = true;
    }
    if (this.paper && this.paper.completionStatus) {
      this.completionStatus.setValue(this.paper.completionStatus);
    }
    if (this.paper && this.paper.noOfCompletePages) {
      this.completedPages.setValue(this.paper.noOfCompletePages);
    }
    this.myOrder = this.data.myOrder;
    this.userService.getCurrentUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.assigned = false;
        if(this.paper && this.paper.writer && this.paper.writer.id === user.id) {
          this.assigned = true;
        }
          this.sharedService.checkAdminRole(this.user).pipe(takeUntil(this.destroy$)).subscribe((role) => this.isAdmin = role);
      }
    });
    if (this.assigned && this.paper) {
      this.userService.getAssignedWriter(this.paper.id).pipe(takeUntil(this.destroy$)).subscribe((writers) => {
        if (writers.length) {
          this.assignedWriter = writers[0];
        }
      });
    }
    if (this.paper && this.paper.files) {
      this.paper.files.forEach((file) => {
        file.downloadUrl
      });
    }
    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((users) => {
      if (users) {
        this.writers = users.filter((user) => user.type === 'writer' && user.approved);
        if (this.assignedWriter) {
          this.writers = this.writers.filter((writer) => writer.id !== this.assignedWriter?.id);
        }
      }
    });
    this.writer.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((writer) => {
      if(writer) {
        this.selectedWriter = this.writers.find((writr) => writr.id == writer) as typeof this.selectedWriter;
      }
    });
  }

  deleteFileUpload(file: FileInterface) {

    // this.uploadFileService.delete(file.name as string, file.filePath as string, file.format).pipe(take(1))
    // .subscribe((res) => {
    //   Swal.fire(
    //     'Deleted!',
    //     'Video has been deleted.',
    //     'success',
    //   );
    //   this.getAllVideos();
    // });

  }

  async assignPaper() {
    if (this.selectedWriter && this.paper) {
      this.selectedWriter.papers ? this.selectedWriter.papers.indexOf(this.paper.id) === -1 ? this.selectedWriter.papers.push(this.paper.id) : '' : this.selectedWriter.papers = [this.paper.id];
      this.paper.assigned = true;
      this.paper.writer = this.selectedWriter;
      await this.userService.updateUserInFirebase(this.selectedWriter);
      await this.paperService.update(this.paper);
      this.snackBar.open('Paper Assigned Successfully', '', {
        duration: 2000
      });
      this.dialogRef.close();
    }
  }

  viewProfile(selectedWriter: UserInterface) {
    const dialogData = {
      writer: selectedWriter,
    };
    const dialogRef: MatDialogRef<WriterProfileComponent> = this.dialog.open(WriterProfileComponent, {
      width: '80vw',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe();
  }

  getDiscipline(code: number) {
    const discipline = this.disciplines.find((discipline) => discipline.code == code);
    return discipline?.name;
  }

  getLevel(code: number) {
    const level = this.levels.find((level) => level.code == code);
    return level?.level;
  }

  getPaperType(code: number) {
    const type = this.paperTypes.find((type) => type.code == code);
    return type?.name;
  }

  getUrgency(dueDate: string | null): string {
    if (dueDate) {
      const diff = Date.parse(dueDate) - Date.parse(new Date().toISOString());
      const diffInHours = diff / (60 * 60 * 1000);
      if (Date.parse(new Date().toISOString()) > Date.parse(dueDate) || diffInHours < 3) {
        return 'red';
      } else {
        if (diffInHours < 24) {
          return 'orange';
        } else {
          return 'green';
        }
      }
    }
    return 'black';
  }

  closeModal() {
    this.dialogRef.close();
  }

  uploadedFileDetails(event: typeof this.fileDetails) {
    if (event && event.length > 0) {
      this.fileDetails = event;
    }
    if (this.paper && this.paper.files && this.paper.files.length > 0 && this.fileDetails) {
      const fileDetails = this.fileDetails.map((file) => Object.fromEntries(Object.entries(file).filter((value) => value[0] !== 'file'))) as typeof this.fileDetails;
      fileDetails.forEach((file) => {
        const index = this.paper?.files?.findIndex((fyl) => fyl.id === file['id']);
        if (index === -1) {
          this.paper && fileDetails && fileDetails.length > 0 && this.paper.files ? this.paper.files = this.paper.files.concat(fileDetails) : this.paper!.files = fileDetails as unknown as PaperInterface['files'];
          if (this.paper && fileDetails && fileDetails.length > 0) {
            this.paper.completionStatus = this.completionStatus.value;
            this.paper.completionStatus == 'partial' ? this.paper.noOfCompletePages = this.completedPages.value : '';
            this.paperService.update(this.paper).then(() => {
              this.snackBar.open('File Uploaded Successfully', '', {
                duration: 2000
              });
            });
          }
        }
      });
    }
    if (this.paper && (!this.paper.files || this.paper.files.length === 0) && this.fileDetails && this.fileDetails.length > 0) {
      const fileDetails = this.fileDetails.map((file) => Object.fromEntries(Object.entries(file).filter((value) => value[0] !== 'file'))) as typeof this.fileDetails;
      this.paper.files = fileDetails as PaperInterface['files']
        this.paper.completionStatus = this.completionStatus.value;
        this.paper.completionStatus == 'partial' ? this.paper.noOfCompletePages = this.completedPages.value : '';
        this.paperService.update(this.paper).then(() => {
          this.snackBar.open('File Uploaded Successfully', '', {
            duration: 2000
          });
        });

    }
  }

  submitComment() {       type: ;
    if (this.comment.valid && this.paper) {
      const comment = {
        comment: this.comment.value as string,
        commentBy: {
          email: this.paper.customer.email,
          name: this.paper.customer.name,
          type: 'customer' as unknown as Partial<'writer' | 'customer' | 'admin'>,
        },
        createdAt: new Date().toISOString(),
      }

      this.paper.comment ? this.paper.comment.push(comment as typeof this.paper.comment[0]) : this.paper.comment = [comment];
      this.paperService.update(this.paper).then(() => {
        this.snackBar.open('Comment Posted Successfully', '', {
          duration: 2000
        });
      })
      .catch((err) => console.log(err));
    }
  }

  approvePaper() {
    if (this.paper) {
      this.paper.approved = true;
      this.paperService.update(this.paper).then(() => {
        this.snackBar.open('Paper Approved Successfully', '', {
          duration: 2000
        });
      })
      .catch((err) => console.log(err));
    }
  }

  approveFile(file: FileInterface) {
    if (this.paper && this.paper.files) {
      const paper = this.paper;
      paper.files!.map((fyle) => {
        if (fyle.id === file.id) {
          fyle.approved = true;
          return fyle;
        }
        return fyle;
      });
      this.paperService.update(paper).then(() => {
        this.snackBar.open('File Approved Successfully', '', {
          duration: 2000
        });
      })
      .catch((err) => console.log(err));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
