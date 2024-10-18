import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import * as e from 'express';
import { NavigationEnd, Router } from '@angular/router';
import { SocketServiceService } from '../socket-service.service';

@Component({
  selector: 'app-cricket-shedule',
  templateUrl: './cricket-shedule.component.html',
  styleUrls: ['./cricket-shedule.component.css']
})
export class CricketSheduleComponent implements OnInit ,OnDestroy{
  livematches: any
  CricketMainTabs: any;
  uocpmingMatchesList: any
  live: Boolean = false
  upcoming: Boolean = false
  result: Boolean = false
  jsonData: any;
  resultList: any;
  resultMatchesList: any;
  cricketMenuList: any;
  upcoming_event_slug: any;
  liveevent_slug: any
  result_slug: any
  resulteventname: any = 'All';
  matchseriesname1 = 'All';
  name = 'Get Current Url Route Demo';
  currentRoute: any;
  tabs1: any;
  activeIndex = null;
  activeIndexupcomingTab = null
  activeIndexresultTab = null
  tabs2: any;
  tabs3: any;
  slugsname: any
  upcomingTab = false
  resultTab = false
  metchesupcoming: any;
  firstIndex = false;
  metchesresult: any;
  allData: any
  liveData: any
  teamDefaultImg = '../../assets/team-default.png'
  convertedDate: any;
  livescorefromapi=true
  loaderlive=true
  loaderUpcoming=true
  loaderResult=true




  constructor(private apiservice: ServiceService, private router: Router, private socket: SocketServiceService) {
    this.router.events.subscribe(() => {
      this.currentRoute = router.url
      this.currentRoute = this.extractSegment(router.url);
    })
  }
  ngOnDestroy(): void {
    this.socket.destorySocket()
  }
  private extractSegment(url: string): string {
    // Remove the leading slash if it exists
    return url.startsWith('/') ? url.slice(1) : url;
  } ngOnInit(): void {
    this.apiservice.getCricketMainTabs().subscribe((res: any) => {
      this.CricketMainTabs = res.data
    })
    this.getmeatches("live")

  }
  getmeatches(matches: any) {
    if (matches == "live") {
      this.live = true
      this.upcoming = false
      this.result = false
      this.apiservice.getLiveMatches().subscribe((res: any) => {
        this.livematches = res.data?.matches
        this.tabs1 = res.data?.tabs
        this.loaderlive=false
        this.livescorefromapi=true

      })
      this.socket.connectSocket()
      this.socket.setLiveMatchesDta('LiveMatches')
      this.socket.getLiveMatchesDta('LiveMatches')
      this.socket.getLiveMatchesUpdatedData().subscribe((res: any) => {
        this.livematches = res.message?.matches?.matches
        this.allData = res.message?.livedata
        this.loaderlive=false

        this.liveData = this.allData?.reduce((acc: any, dt: any) => {
          acc[dt.id] = dt;
          return acc;
        }, {})
        this.livescorefromapi=false
        this.loaderlive=false


        this.tabs1 = res.message?.matches?.tabs
      })
    } else if (matches == "upcoming") {
      this.live = false
      this.upcoming = true
      this.result = false
      this.apiservice.getUpcomingMatches()?.subscribe((res: any) => {
        this.jsonData = res.data?.matches
        this.tabs2 = res.data?.tabs
        this.loaderUpcoming=false

      })

    } else if (matches == "result") {
      this.live = false
      this.upcoming = false
      this.result = true
      this.apiservice.getResultMatches().subscribe((res: any) => {
        this.resultList = res.data?.matches
        this.tabs3 = res.data?.tabs
        this.loaderResult=false

      })
    }
  }
  getKeysWithArrayValue(data: any): any[] {
    return Object?.keys(data)?.filter(key => Array?.isArray(data[key]));
  }
  addOrdinalSuffix(num: string): string {
    const numInt = parseInt(num);
    const suffix = ["th", "st", "nd", "rd"];
    const v = numInt % 100;
    return numInt + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  }

  getMatchesBySeries(slug: any) {
    if (slug == 'All') {
      this.upcomingTab = false
      this.activeIndexupcomingTab = null
    }
  }

  getMatchesBySeries1(slug: any, index: any) {
    if (slug == 'All') {
      this.matchseriesname1 = 'All'
      this.activeIndex = null
    }
    else {
      this.firstIndex = true
      this.activeIndex = null
    }
    this.matchseriesname1 = slug

    this.activeIndex = index;
  }

  convertMatchTitle(title: string): string {
    const teams = title.split('-'); // Split the string into an array of teams
    const convertedTitle = teams.reverse().join(' vs '); // Reverse the array and join it back with " vs "
    return convertedTitle;
  }
  datetime(date: any) {
    return date.toString()

  }
  getkeysdata(obj: any) {
    return Object?.keys(obj)
  }

  upcomingevent_slug(name: any) {
    this.upcoming_event_slug = name
  }

  liveevent_slugs(name: any) {
    this.liveevent_slug = name
  }
  resultevent_slug(name: any) {
    this.result_slug = name
  }
  getUpcomingMatchesBySeries(slug: any, index: any) {
    this.activeIndexupcomingTab = index;
    this.upcomingTab = true
    this.apiservice.getUpcomingMatchesBySeries(slug).subscribe((re: any) => {
      this.metchesupcoming = re.data

    })
  }
  getResultMatchesBySeries(slug: any, index: any) {
    this.resulteventname = slug
    this.activeIndexresultTab = index;
    this.resultTab = true
    this.apiservice.getResultMatchesBySeries(slug).subscribe((re: any) => {
      this.metchesresult = re.data
    })
  }

  getMatchesBySeriesresult(slug: any) {
    if (slug == 'All') {
      this.resultTab = false
      this.activeIndexresultTab = null
    }
  }
  getTime(formatted_date: any) {
    const timeIndex = formatted_date.lastIndexOf(',');
    return formatted_date.substring(timeIndex + 2).trim();
  }

  getDay(formatted_date: any) {
    const dayIndex = formatted_date.indexOf(',');
    return formatted_date.substring(0, dayIndex).trim();
  }

  userByName(index: any) {
    return index;
  }
  checkIfMobile(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 768; // Example threshold for mobile view
  }
  getrouteandCheckwidth(route: any, route1: any, id: any) {
    let url1 = route + '/' + id
    let url2 = route1 + '/' + id
    const isMobile = this.checkIfMobile();
    if (isMobile) {
      this.router.navigateByUrl(url2);
    } else {
      this.router.navigateByUrl(url1);
    }
  }

  convertDate(datetime: any) {
    const currentDate = new Date();
    const providedDate = new Date(datetime);
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const tomorrow = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    if (providedDate.toDateString() === today.toDateString()) {
      this.convertedDate = 'Today';
    } else if (providedDate.toDateString() === tomorrow.toDateString()) {
      this.convertedDate = 'Tomorrow';
    } else {
      this.convertedDate = providedDate.toLocaleDateString('en-US');
      const date = new Date(this.convertedDate);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayOfWeek = daysOfWeek[date.getDay()];
      const dayOfMonth = date.getDate();
      const month = months[date.getMonth()];
      return `${dayOfWeek}, ${dayOfMonth} ${month}`;
    }
    return this.convertedDate
  }
  datetimedata(utcString: any) {
    const utcDate = new Date(utcString);
    const localDateString = utcDate.toLocaleString();
    return localDateString.split(",")
  }

  getScoreForMatch(matchId: string, teamShortName: string): string {
    const matchData = this.liveData[matchId];
    if (matchData) {
      const teamScore = matchData.score_strip.find((score: any) => score.short_name === teamShortName);
      if (teamScore) {
        return teamScore.score
      }
    }
    return 'Score data not available';
  }

}
