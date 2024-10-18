import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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

  ngOnInit(): void {

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
