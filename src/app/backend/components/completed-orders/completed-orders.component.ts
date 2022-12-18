import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Subject, takeUntil, tap, take } from 'rxjs';
import { LevelInterface } from 'src/app/shared/interfaces/level.interface';
import { PaperDisciplineInterface } from 'src/app/shared/interfaces/paper-discipline.interface';
import { PaperTypeInterface } from 'src/app/shared/interfaces/paper-type.interface';
import { PaperInterface } from 'src/app/shared/interfaces/paper.interface';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { DisciplineService } from 'src/app/shared/services/discipline/discipline.service';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { PaperTypeService } from 'src/app/shared/services/paper-type/paper-type.service';
import { PaperService } from 'src/app/shared/services/paper/paper.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ViewPaperComponent } from '../view-paper/view-paper.component';

@Component({
  selector: 'app-completed-orders',
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.scss']
})
export class CompletedOrdersComponent implements OnInit {

  displayedColumns: string[] = ['topic', 'discipline', 'mode', 'format', 'levelCode', 'paperTypeCode', 'deadline', 'more'];

  dataSource = new MatTableDataSource<PaperInterface>;

  destroy$ = new Subject();

  papers: PaperInterface[] | [] = [];

  paperTypes: PaperTypeInterface[] = [];

  levels: LevelInterface[] = [];

  disciplines: PaperDisciplineInterface[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  user: UserInterface | null = null;

  constructor(
    private paperService: PaperService,
    private dialog: MatDialog,
    private paperTypeService: PaperTypeService,
    private levelService: LevelService,
    private disciplineService: DisciplineService,
    private userService: UserService
    ) {

   }

  ngOnInit(): void {
    this.userService.getCurrentUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
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
    this.paperService.getAllAvailablePapers().pipe(takeUntil(this.destroy$)).subscribe((papers) => {
      this.papers = papers.filter((paper) => paper.approved);
      this.dataSource = new MatTableDataSource(this.papers);
      this.dataSource.paginator = this.paginator;
    });
  }

  viewPaper(paper: PaperInterface) {
    let myOrder = false;
    if (this.user && paper.writer) {
      if (paper.writer.id === this.user.id) {
        myOrder = true;
      }
    }
    const dialogData = {
      paper: paper,
      assigned: false,
      myOrder: myOrder
    };
    const dialogRef: MatDialogRef<ViewPaperComponent> = this.dialog.open(ViewPaperComponent, {
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
