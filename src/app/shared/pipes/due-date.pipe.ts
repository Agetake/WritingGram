import { Pipe, PipeTransform } from '@angular/core';
import { PaperInterface } from '../interfaces/paper.interface';

@Pipe({
  name: 'dueDate'
})
export class DueDatePipe implements PipeTransform {

  transform(paper: PaperInterface): Date {

    const orderDate = new Date(paper.createdAt.slice(0, -1));
    const orderTime = orderDate.getTime();
    const dueTime = new Date(orderTime + paper.deadline * 60 * 60 * 1000);
    return new Date(dueTime);
  }

}
