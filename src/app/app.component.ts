import { Component, OnInit } from '@angular/core';
import { DittoService } from './ditto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private dittoService: DittoService) {}
  ngOnInit(): void {
    this.dittoService.onInit()
  }
}

