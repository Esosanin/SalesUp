import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-select-with-search',
  templateUrl: './select-with-search.component.html',
  styleUrls: ['./select-with-search.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class SelectWithSearchComponent implements OnInit {

  openModal = false;
  selectedValue = Object();
  values = Array();
  values2 = Array();
  limite = 20;

  constructor() {
  }

  ngOnInit() { }

  getMoreValues(event: any) {
    this.limite += 20;
    event.target.complete();
  }

  searchChange(searchValue: string | undefined | null) {
    if (searchValue) {
      this.values = this.values2.filter((value: any) =>
        value.nombre
          .toString()
          .toLowerCase()
          .normalize('NFD')
          .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
          .includes(
            searchValue
              .toString()
              .toLowerCase()
              .normalize('NFD')
              .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
          )
      );
    } else {
      this.values = this.values2;
    }
  }

  open() {
    this.openModal = true;
  }

  close() {
    this.openModal = false;
  }

}
