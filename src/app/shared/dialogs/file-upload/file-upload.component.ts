import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUpload } from '../../classes/file-upload';
import { UserInterface } from '../../interfaces/user.interface';
import { FileUploadService } from '../../services/file-upload/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef | null = null;

  fileAttr = 'Choose File';

  selectedFile: FileList | null = null;

  loading = true;

  user: UserInterface | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.user = this.data.user;
  }

  uploadFileEvt(event: Event) {
    this.fileAttr = 'Choose File';
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files;
    if (this.selectedFile && this.selectedFile.length > 0) {
      this.fileAttr = (this.selectedFile[0] as unknown as { name: string}).name;
      this.loading = false;
    }
  }

  submitFile() {
    if (this.selectedFile) {
      this.loading = true;
      Array.from(this.selectedFile).forEach((file: File | null) => {
        this.selectedFile = null;
        if (file && this.user) {
          const filename = file.name;
          const extension = filename.substring(filename.lastIndexOf('.')).toUpperCase();
          switch(this.data.type) {
            case 'logo':
              // code block for logo
              if (extension === '.JPG' || extension === '.PNG' || extension === '.JPEG') {
                const currentFileUpload = new FileUpload(file);
                this.fileUploadService.pushFileToStorage(this.user, currentFileUpload, this.data.type).subscribe((res) => {
                  this.dialogRef.close();
                  this.snackBar.open('File Uploaded Successfully', '', {
                    duration: 2000
                  });
                });
              } else {
                throw new Error('Unsupported file type.');
              }
              break;
              case 'sample-essay':
                // code block for business permit
                if (extension === '.DOC' || extension === '.PDF' || extension === '.DOCX') {
                  const currentFileUpload = {
                    file: new FileUpload(file),
                    fileId: this.data.fileId
                  };
                  this.fileUploadService.pushFileToStorage(this.user, currentFileUpload.file, this.data.type).subscribe((res) => {
                    this.dialogRef.close();
                    this.snackBar.open('File Uploaded Successfully', '', {
                      duration: 2000
                    });
                  });
                } else {
                  throw new Error('Unsupported file type.');
                }
                break;
                case 'paper-materials':
                  // code block for business permit
                  if (extension === '.JPG' || extension === '.PNG' || extension === '.JPEG' || extension === '.PDF') {
                    const currentFileUpload = new FileUpload(file);
                    this.fileUploadService.pushFileToStorage(this.user, currentFileUpload, this.data.type).subscribe((res) => {
                      this.dialogRef.close();
                      this.snackBar.open('File Uploaded Successfully', '', {
                        duration: 2000
                      });
                    });
                  } else {
                    throw new Error('Unsupported file type.');
                  }
                  break;
            default:
              // code block for document
              if (extension === '.PDF' || extension === '.DOC' || extension === '.DOCX' || extension === '.JPG' || extension === '.PNG' || extension === '.JPEG') {
                const currentFileUpload = new FileUpload(file);
                this.fileUploadService.pushFileToStorage(this.user, currentFileUpload, this.data.type).subscribe();
              } else {
                throw new Error('Unsupported file type.');
              }
          }
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}


