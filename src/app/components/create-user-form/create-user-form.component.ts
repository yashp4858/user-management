import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css'],
})
export class CreateUserFormComponent {
  userForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data; // If data exists, we are editing
    this.userForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      email: [
        { value: data?.email || '', disabled: this.isEditMode },
        [Validators.required, Validators.email],
      ], // Email is disabled in edit mode
      role: [data?.role || '', Validators.required],
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (this.isEditMode) {
        // Update existing user
        const index = users.findIndex((u: any) => u.email === this.data.email);
        if (index !== -1) {
          users[index].name = this.userForm.value.name;
          users[index].role = this.userForm.value.role;
        }
      } else {
        // Add new user
        users.push(this.userForm.value);
      }

      localStorage.setItem('users', JSON.stringify(users));
      this.dialogRef.close();
    }
  }
}
