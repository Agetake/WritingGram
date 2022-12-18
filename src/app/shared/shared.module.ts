import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FileUploadComponent } from './dialogs/file-upload/file-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import { DeadlinePipe } from './pipes/deadline.pipe';
import { DueDatePipe } from './pipes/due-date.pipe';
import { CountryPipe } from './pipes/country.pipe';
import { FileUploadModalComponent } from './components/file-upload-modal/file-upload-modal.component';
import { FileUploadWidgetComponent } from './components/file-upload-widget/file-upload-widget.component';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    LoaderComponent,
    PageNotFoundComponent,
    FileUploadComponent,
    DeadlinePipe,
    DueDatePipe,
    CountryPipe,
    FileUploadModalComponent,
    FileUploadWidgetComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatListModule,
    MatProgressBarModule,
  ],
  exports: [
    NavigationComponent,
    FooterComponent,
    LoaderComponent,
    DeadlinePipe,
    DueDatePipe,
    CountryPipe,
    FileUploadWidgetComponent
  ]
})
export class SharedModule { }
