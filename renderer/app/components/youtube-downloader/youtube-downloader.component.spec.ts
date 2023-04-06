import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeDownloaderComponent } from './youtube-downloader.component';

describe('YoutubeDownloaderComponent', () => {
  let component: YoutubeDownloaderComponent;
  let fixture: ComponentFixture<YoutubeDownloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubeDownloaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
