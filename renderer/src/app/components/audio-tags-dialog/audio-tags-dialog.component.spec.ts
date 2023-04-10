import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioTagsDialogComponent } from './audio-tags-dialog.component';

describe('AudioTagsDialogComponent', () => {
  let component: AudioTagsDialogComponent;
  let fixture: ComponentFixture<AudioTagsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioTagsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
