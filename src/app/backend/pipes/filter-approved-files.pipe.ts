import { Pipe, PipeTransform } from '@angular/core';
import { FileInterface } from 'src/app/shared/interfaces/file.interface';

@Pipe({
  name: 'filterApprovedFiles'
})
export class FilterApprovedFilesPipe implements PipeTransform {

  transform(files: FileInterface[]): FileInterface[] {
    return files.filter((file) => file.approved);
  }

}
