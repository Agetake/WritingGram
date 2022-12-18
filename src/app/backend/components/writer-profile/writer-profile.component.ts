import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PaperInterface } from 'src/app/shared/interfaces/paper.interface';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { PaperService } from 'src/app/shared/services/paper/paper.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ViewPaperComponent } from '../view-paper/view-paper.component';

@Component({
  selector: 'app-writer-profile',
  templateUrl: './writer-profile.component.html',
  styleUrls: ['./writer-profile.component.scss']
})
export class WriterProfileComponent implements OnInit, OnDestroy {

  destroy$ = new Subject();

  user: UserInterface | null = null;

  papers: PaperInterface[] | [] = [];

  loading = true;

  totalCount = 0;

  constructor(
    @Optional() public dialogRef: MatDialogRef<WriterProfileComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data:any,
    private userService: UserService,
    private paperService: PaperService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.writer) {
      this.user = this.data.writer;
      this.paperService.getMyPapers(this.data.writer).then((papers) => {
        this.papers = papers;
        this.papers = this.papers.slice(0, 2);
        this.loading = false;
      });
    } else {
      this.userService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(async (user) => {
        if (user) {
          this.user = user;
          this.papers = await this.paperService.getMyPapers(user);
          this.papers = this.papers.slice(0, 2);
          this.loading = false;
          if (user.completedOrders && user.completedOrders.length) {
            let totalCount = 0;
            user.completedOrders.forEach((order) => {
              totalCount = totalCount += order.count;
            });
            this.totalCount = totalCount;
          }
        }
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  viewPaper(paper: PaperInterface) {
    const dialogData = {
      paper: paper,
      assigned: false,
      myOrder: true
    };
    const dialogRef: MatDialogRef<ViewPaperComponent> = this.dialog.open(ViewPaperComponent, {
      width: '80vw',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
