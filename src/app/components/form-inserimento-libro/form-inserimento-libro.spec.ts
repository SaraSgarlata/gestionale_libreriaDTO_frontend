import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInserimentoLibro } from './form-inserimento-libro';

describe('FormInserimentoLibro', () => {
  let component: FormInserimentoLibro;
  let fixture: ComponentFixture<FormInserimentoLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInserimentoLibro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInserimentoLibro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
