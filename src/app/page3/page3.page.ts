import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page3',
  templateUrl: './page3.page.html',
  styleUrls: ['./page3.page.scss'],
  standalone:false,
})
export class Page3Page implements OnInit {

  History() { // Function to navigate to the history page
    this.router.navigate(['history']);
  }

  howtouse() { // Function to navigate to the howtouse page
    this.router.navigate(['howtouse']);
  }

  App_report() { // Function to navigate to the app-report page 
    this.router.navigate(['app-report']);
  }
  
  updatelist() { // Function to navigate to the update-list page
    this.router.navigate(['updatelist']);
  }

  About() { // Function to navigate to the about page
    this.router.navigate(['about']);
  }



  // put constructor(public router:Router) { } in the constructor
  constructor(private router: Router) { }

  ngOnInit() {
  }

}
