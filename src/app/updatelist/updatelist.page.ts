import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-updatelist',
  templateUrl: './updatelist.page.html',
  styleUrls: ['./updatelist.page.scss'],
  standalone: false,
})
export class UpdatelistPage implements OnInit {
  Updatedisplay = [
    {"version": 'Version: V3.0'},
    {"content": 'Add science calculator'},
    {"content": 'Add Mistral AI'},
    {"content": 'Add how to use in menu'},
    {"content": ''},
    {"content": ''},
  ]

  constructor() { }

  ngOnInit() {
  }

}
