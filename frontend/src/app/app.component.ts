import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import SwiperCore, { Navigation, Pagination } from 'swiper';

// // install Swiper modules
// SwiperCore.use([Navigation, Pagination]);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // encapsulation : ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'sportsKeeda';
  mobilview: Boolean = false
  desktopview: Boolean = true

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) {
      this.mobilview = true
      this.desktopview = false
    } else {
      this.mobilview = false
      this.desktopview = true
    }
    // setInterval(()=>{
    //   console.clear()
    // },1000*1)
  }

}
