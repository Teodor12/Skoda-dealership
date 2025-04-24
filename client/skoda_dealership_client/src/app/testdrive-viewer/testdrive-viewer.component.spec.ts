import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestdriveViewerComponent } from './testdrive-viewer.component';

describe('TestdriveViewerComponent', () => {
  let component: TestdriveViewerComponent;
  let fixture: ComponentFixture<TestdriveViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestdriveViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestdriveViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
