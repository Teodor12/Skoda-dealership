import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestDriveService } from '../shared/services/test-drive/test-drive.service';
import { MongoTestDrive } from '../shared/model/mongo/MongoTestDrive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-testdrive-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './testdrive-viewer.component.html',
  styleUrl: './testdrive-viewer.component.scss',
})
export class TestdriveViewerComponent {

  testDrives: MongoTestDrive[] = [];

  constructor(private testDriveService: TestDriveService) {}

  ngOnInit() {
    this.testDriveService.getAll().subscribe({
      next: (data) => {
        this.testDrives = data;
        console.log(this.testDrives)
      }
    });
  }
}
