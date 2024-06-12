import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViaticosHospedajesPage } from './viaticos-hospedajes.page';

describe('ViaticosHospedajesPage', () => {
  let component: ViaticosHospedajesPage;
  let fixture: ComponentFixture<ViaticosHospedajesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViaticosHospedajesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViaticosHospedajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
