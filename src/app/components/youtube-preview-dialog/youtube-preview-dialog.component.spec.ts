import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubePreviewDialogComponent } from './youtube-preview-dialog.component';

describe('YoutubePreviewDialogComponent', () => {
  let component: YoutubePreviewDialogComponent;
  let fixture: ComponentFixture<YoutubePreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubePreviewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubePreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
