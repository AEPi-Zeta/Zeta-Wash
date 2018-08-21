import { Component, OnInit, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() topBarTitle: any;

  constructor() { }

  ngOnInit() {
  }

}
