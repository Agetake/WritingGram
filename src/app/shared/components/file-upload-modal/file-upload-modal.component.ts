import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith } from 'rxjs';
import { FileExtension } from '../../classes/file-extension';
import { FileUploadDialogDataInterface, UploadedFileInterface } from '../../interfaces/file.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { UploadFilesService } from '../../services/file/upload-files.service';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.scss']
})
export class FileUploadModalComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef | null = null;

  fileUploaded = false;

  fileName = '';

  uploadedFiles: { id: string, name: string; file: File, originalFileName: string; uploaded:boolean, valid: boolean}[] | null = null;

  selectedFiles: FileList | null = null;

  newFileName: FormControl = new FormControl('');

  accessMode: FormControl = new FormControl('');

  percentage: number | undefined = undefined;

  uploadRes: {id: string, percent: number} | undefined = undefined;

  fileDetails: UploadedFileInterface[] | null = null;

  supportedExts: string[] | [] = [];

  user: UserInterface | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:FileUploadDialogDataInterface,
    private sharedService: SharedService,
    public uploadFileService: UploadFilesService,
    public dialogRef: MatDialogRef<FileUploadModalComponent>,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    if (this.data && this.data.type) {
      const fileExts = new FileExtension(this.data.type).extensions();
      this.supportedExts = fileExts;
    }
    this.uploadFileService.fileDetails$.next(null);
    this.uploadFileService.percentage$.pipe(startWith({id: '', percent: 0})).subscribe((res) => {
      this.uploadRes = res;
      if (this.uploadedFiles && res) {
        this.uploadedFiles.map((file) => {
          if (file.id === res.id && res.percent === 100) {
            file.uploaded = true;
          }
        });
      }
    });
  }

  chooseFile() {
    this.fileInput?.nativeElement.click();
  }

  removeFile(fileId: string) {
    if (this.uploadedFiles) {
      this.uploadedFiles = this.uploadedFiles.filter((file) => file.id !== fileId);
    }
  }

  uploadFileEvt(event: Event) {
    this.fileUploaded = true;
    this.uploadedFiles = null;
    const target = event.target as HTMLInputElement;
    this.selectedFiles = target.files;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.prepareData(this.selectedFiles);
    }
  }

  prepareData(files: FileList) {
    const uploadedFiles = Array.from(files);
    uploadedFiles.forEach((selectedFile) => {
      const fileId = this.sharedService.generateUniqueId(selectedFile.name).replace(" ", "");
      const valid = this.checkValidity(selectedFile);
      const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      const originalFileName = selectedFile.name;
      const renamedFile = new File([selectedFile], `${fileId}${extension}`);
      const uploadedFile = {
        id: fileId,
        file: renamedFile,
        name: renamedFile.name,
        uploaded: false,
        valid,
        originalFileName,
      };
      if (uploadedFile.valid) {
        this.uploadedFiles ? this.uploadedFiles.push(uploadedFile) : this.uploadedFiles = [uploadedFile];
      }
    });
  }

  checkValidity(selectedFile: File): boolean {
    const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toUpperCase();
    const supported = (this.supportedExts as string[]).includes(extension);
    return supported;
  }

  cancelSelection() {
    this.uploadedFiles = [];
  }

  async uploadFiles() {
    if (this.uploadedFiles && this.uploadedFiles.length > 0 && this.user) {
      const newUploadedFiles = this.uploadedFiles.filter((file) => file.valid);
      try {
        await Promise.all(newUploadedFiles.map(async (uploadedFile) => {
          const snapshot = await this.uploadFileService.pushFileToStorage(uploadedFile, this.data.type);
          const downloadUrl = await snapshot.ref.getDownloadURL();
          const storagePath = `${this.data.filePath}/${uploadedFile.file.name}`;
          const fileDetails = {
            id: uploadedFile.id,
            name: uploadedFile.file.name,
            originalFileName: uploadedFile.originalFileName,
            file: uploadedFile.file,
            filePath: storagePath,
            downloadUrl,
            type: this.data.type,
            uploadedBy: this.user as UserInterface,
            approved: false,
            uploadedOn: new Date().toISOString(),
          };
          this.fileDetails ? this.fileDetails.some((file) => file.id !== fileDetails.id) ? this.fileDetails.push(fileDetails) : '' : this.fileDetails = [fileDetails];
        }));
        this.uploadFileService.fileDetails$.next(this.fileDetails);
      } catch (error) {
        console.log(error);
      }
    }
  }

  closeDialog() {
    this.dialogRef.close({fileDetails: this.fileDetails});
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event && event.dataTransfer) {
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        this.prepareData(event.dataTransfer.files);
      }
    }
  }
  onDragOver(event: DragEvent) {
      event.stopPropagation();
      event.preventDefault();
  }

  openUploadWidget() {
    this.fileInput?.nativeElement.click();
  }

  closeModal() {
    this.dialogRef.close();
  }

  get canUpload() {
    if (!this.uploadedFiles) {
      return false;
    }
    const newUploadedFiles = this.uploadedFiles.find((file) => file.valid);
    if (newUploadedFiles) {
      return true;
    }
    return false;
  }
}
