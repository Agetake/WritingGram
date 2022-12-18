import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileUploadModalComponent } from '../file-upload-modal/file-upload-modal.component';
import { UploadFilesService } from '../../services/file/upload-files.service';
import { FileUploadDialogDataInterface } from '../../interfaces/file.interface';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-file-upload-widget',
  templateUrl: './file-upload-widget.component.html',
  styleUrls: ['./file-upload-widget.component.scss']
})
export class FileUploadWidgetComponent {

  @Input() uploadButtonName = 'Upload File';

  @Input() fileType: FileUploadDialogDataInterface['type'] = 'essay';

  @Output() fileDetails = new EventEmitter();

  @Input() filePath = '';

  constructor(
    public dialog: MatDialog,
    private uploadFileService: UploadFilesService
    ) {}

  openDialog(): void {
      const dialogData: FileUploadDialogDataInterface = {
        type: this.fileType,
        filePath: this.filePath,
      };
      console.log('dialog data', dialogData)
      const dialogRef: MatDialogRef<FileUploadModalComponent> = this.dialog.open(FileUploadModalComponent, {
        width: '60vw',
        data: dialogData,
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
        this.uploadFileService.fileDetails$.pipe(filter((file) => file !== null ), take(1)).subscribe((res) => {
          this.fileDetails.emit(res);
        });
      });
  }
}
