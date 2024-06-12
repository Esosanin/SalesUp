import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SaldosViaticosColabPage } from './saldos-viaticos-colab.page';

describe('SaldosViaticosColabPage', () => {
  let component: SaldosViaticosColabPage;
  let fixture: ComponentFixture<SaldosViaticosColabPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldosViaticosColabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SaldosViaticosColabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
