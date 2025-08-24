import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidecardsComponent } from './sidecards.component';

describe('SidecardsComponent', () => {
  let component: SidecardsComponent;
  let fixture: ComponentFixture<SidecardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidecardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidecardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
