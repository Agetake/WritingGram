import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { finalize, firstValueFrom, lastValueFrom, merge, mergeMap, Observable, take } from 'rxjs';
import { FileUpload } from '../../classes/file-upload';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FileInterface } from '../../interfaces/file.interface';
import { arrayUnion } from '@firebase/firestore';
import { UserInterface } from '../../interfaces/user.interface';
import { UserService } from '../user/user.service';
import { PaperService } from '../paper/paper.service';
import { PaperInterface } from '../../interfaces/paper.interface';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private basePath = '/AgriDuka/app-uploads/files';

  constructor(
    private sharedService: SharedService,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private userService: UserService,
    private paperService: PaperService
    ) { }

  pushFileToStorage(
    user: UserInterface,
    fileUpload: FileUpload,
    fileType: string,
  ): Observable<number | undefined> {
    let filePath = this.basePath;
    let fileDetails = {
      downloadUrl: '',
      name: '',
      id: '',
      type: fileType,
      uploadedBy: user,
      approved: false,
      uploadedOn: new Date().toISOString(),
    }
    if (fileType == 'logo') {
      filePath = `${this.basePath}/logos/${fileUpload.file.name}`;
    }
    if (fileType == 'sample-essay') {
      filePath = `${this.basePath}/sample-essays/${fileUpload.file.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileUpload.file);
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(async (downloadURL) => {
              if (user.samplePapers && user.samplePapers.length) {
                user.samplePapers.map((paper) => {
                  paper.downloadUrl.length < 2 ? paper.downloadUrl = downloadURL : '';
                  return paper;
                });
              }
              const fileId = this.sharedService.generateUniqueId(
                fileUpload.file.name,
              );
              fileDetails.downloadUrl = downloadURL;
              fileDetails.name = fileUpload.file.name;
              fileDetails.id = fileId;
              fileDetails.uploadedBy = user;
              user.files && user.files.length ? user.files.push(fileDetails) : user.files = [fileDetails];
              await this.userService.updateUserInFirebase(user)
            });
          }),
        )
        .subscribe();
      return uploadTask.percentageChanges();
    }
    if (fileType == 'paper-materials') {
      filePath = `${this.basePath}/paper-materials/${fileUpload.file.name}`;
    }
    if (fileType == 'registration-cert') {
      filePath = `${this.basePath}/registration-certs/${fileUpload.file.name}`;
    }
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(async (downloadURL) => {
            const fileId = this.sharedService.generateUniqueId(
              fileUpload.file.name,
            );
            fileDetails.downloadUrl = downloadURL;
            fileDetails.name = fileUpload.file.name;
            fileDetails.id = fileId;
            const paperId = user && user.papers ? user.papers[0] : '';
            let paper: PaperInterface | undefined = await lastValueFrom(this.paperService.getPaper(paperId).pipe(take(1)));
            if (paper && paper.files && paper.files.length > 0) {
              if(!paper.files.some((file) => file.id === fileDetails.id)) {
                paper.files.push(fileDetails);
              }
            } else {
              paper ? paper.files = [fileDetails] : '';
            }
            if (paper) {
              await this.saveFileData(fileDetails, user, paper);
              this.paperService.getPaper(paper.id).pipe(take(1), mergeMap(async (updatedPaper) => {
              if (updatedPaper) {
                await this.userService.addPaperToUser(user, updatedPaper);
              }
            })).subscribe();
          }
          });
        }),
      )
      .subscribe();
    return uploadTask.percentageChanges();
  }

  private async saveFileData(
    fileDetails: FileInterface,
    user: UserInterface,
    paper: PaperInterface,
  ): Promise<void> {
    if (paper) {
      if (paper.files && paper.files.length > 0) {
        paper.files.push(fileDetails);
      } else {
        paper.files = [fileDetails];
      }
      const paperDoc: AngularFirestoreDocument<PaperInterface> = this.afs.doc<PaperInterface>(`papers/${paper.id}`);
      return paperDoc
        .update({ files: arrayUnion(fileDetails) as unknown as FileInterface[] });
    } else {
      Promise.resolve(null);
    }
  }
}
