import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  private basePath = '';

  percentage$ = new Subject<{id: string, percent: number} | undefined>();

  fileDetails$ = new BehaviorSubject<{id: string, name: string, downloadUrl: string}[] | null>(null);

  constructor(
    private storage: AngularFireStorage,
  ) { }

  pushFileToStorage(
    fileUpload: {id: string, file: File},
    fileType: string,
  ): AngularFireUploadTask {
    let filePath = `${this.basePath}/${fileType}s/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = storageRef.put(fileUpload.file);
    uploadTask.snapshotChanges().subscribe((res) => {
      if (res) {
        let percentage =
        (res.bytesTransferred / res.totalBytes) * 100;
        this.percentage$.next({id: fileUpload.id, percent: percentage});
      }
    });

    return uploadTask
  }

  delete(fileName: string, filePath: string, format: string) {
    let basePath = '';
    if (filePath.includes('.')) {
      const fileNameIndex = filePath.lastIndexOf('/');
      basePath = filePath.slice(0, fileNameIndex);
    } else {
      basePath = filePath;
    }
    const file = `${fileName}.${format}`;
    console.log('file file file', file);
    const storageRef = this.storage.ref(basePath);
    return storageRef.child(file).delete();
  }
}
