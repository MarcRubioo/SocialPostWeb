import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoriesListingComponent } from './admin-categories-listing.component';

describe('AdminCategoriesListingComponent', () => {
  let component: AdminCategoriesListingComponent;
  let fixture: ComponentFixture<AdminCategoriesListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCategoriesListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoriesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
