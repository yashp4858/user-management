import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserFormComponent } from '../create-user-form/create-user-form.component';

export interface UserData {
  name: string;
  email: string;
  role: string;
}

const ELEMENT_DATA: UserData[] = [
  { name: 'Test User', email: 'testuser@gmail.com', role: 'Admin' },
];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    const users = localStorage.getItem('users');
    this.dataSource.data = users ? JSON.parse(users) : [];
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  addUser(): void {
    const dialogRef = this.dialog.open(CreateUserFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => this.loadUsers());
  }

  openEditUserDialog(user: UserData): void {
    const dialogRef = this.dialog.open(CreateUserFormComponent, {
      width: '400px',
      data: user, // Passing existing user data
    });

    dialogRef.afterClosed().subscribe(() => this.loadUsers());
  }

  deleteUser(user: UserData) {
    const users = this.dataSource.data.filter((u) => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(users));
    this.loadUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
