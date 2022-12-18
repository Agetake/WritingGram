import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewUserComponent } from '../view-user/view-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  destroy$ = new Subject();

  users: UserInterface[] = [];

  displayedColumns: string[] = ['name', 'email', 'type', 'country', 'createdAt', 'active', 'more'];

  dataSource = new MatTableDataSource<UserInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((users) => {
      this.users = users;
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    });
  }

  viewUser(user: UserInterface) {
    const dialogData = {
      user: user,
    };
    const dialogRef: MatDialogRef<ViewUserComponent> = this.dialog.open(ViewUserComponent, {
      width: '80vw',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
