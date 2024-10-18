import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-commonpage',
  templateUrl: './commonpage.component.html',
  styleUrls: ['./commonpage.component.css']
})
export class CommonpageComponent implements OnInit {
  turnament: any = "england-vs-india"
  mostrunList: any
  seriesInfo: any;
  pageName = "Most Runs"
  routeName: any
  upcominglist: any
  resultdata: any
  selectedTabupcoming = true
  resulttab = false

  loader = true
  errorMessage: any
  defalutimg = "../../assets/team-default.png"
  selectedNewsTab = 'latest'
  latestNewsList: any
  popularNewsList: any

  constructor(private apiService: ServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.turnament = this.route.snapshot.paramMap.get('event_slug');
    })
    this.route.paramMap.subscribe((param: any) => {
      let data = param.get('stricks');
      this.getDataFromRouteT(data)
    })
    this.getSeriesInfo()
    this.getupcomming()
    this.getneswdata('latest')
    this.popularNewsdata('latest')
  }

  getDataFromRouteT(data: any) {
    this.routeName = data
    this.loader = true
    setTimeout(() => {
      this.loader = false;
    }, 1000);
    if (this.routeName == 'most-runs') {
      this.apiService.getSeriesMostRuns(this.turnament).subscribe((res: any) => {
        this.mostrunList = res.data
        this.loader = false
      }, (error) => {
        this.loader = false
        this.mostrunList = []
        this.errorMessage = error.error.message
      }
      )
    } else if (this.routeName == 'most-wickets') {
      this.apiService.getSeriesMostwickets(this.turnament).subscribe((res: any) => {
        this.mostrunList = res.data
        this.loader = false

      }, (error) => {
        this.loader = false
        this.mostrunList = []
        this.errorMessage = error.error.message

      })
    } else if (this.routeName == 'orange-cap') {
      this.mostrunList = []
      this.apiService.getSeriesOrangeCap(this.turnament).subscribe((res: any) => {
        this.mostrunList = res.data

        this.loader = false
      }, (error) => {
        this.loader = false
        this.mostrunList = []
        this.errorMessage = error.error.message

      })
    } else if (this.routeName == 'purple-cap') {
      this.apiService.getSeriesPurpleCap(this.turnament).subscribe((res: any) => {
        this.mostrunList = res.data
        this.loader = false

      }, (error) => {
        this.loader = false
        this.mostrunList = []
        this.errorMessage = error.error.message
      })
    } else
      if (this.routeName == "most-fours") {
        this.apiService.getSeriesMost4s(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data

          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "most-sixes") {
        this.apiService.getSeriesMost6s(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "best-strike-rate") {
        this.apiService.getSeriesHighestStrikeRate(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "highest-scores") {
        this.apiService.getSeriesHighestIndividualScore(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "most-fifties") {
        this.apiService.getSeriesMostFifties(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "most-hundreds") {
        this.apiService.getSeriesMostHundreds(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "best-economy") {
        this.apiService.getSeriesBestEconomy(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "most-maidens") {
        this.apiService.getSeriesMostMaidens(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "best-bowling-average") {
        this.apiService.getSeriesBestBowlingFigures(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "most-four-wickets") {
        this.apiService.getSeriesMost4wickets(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "most-five-wickets") {
        this.apiService.getSeriesMost5wickets(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      } else if (this.routeName == "best-bowling-strike-rate") {
        this.apiService.getSeriesBestBowlingStrikeRate(this.turnament).subscribe((res: any) => {
          this.mostrunList = res.data
          this.loader = false

        }, (error) => {
          this.loader = false
          this.mostrunList = []
          this.errorMessage = error.error.message
        })
      }
  }
  onSelectChange(event: any): void {
    const selectedRoute = event.target.value;
    this.routeName = selectedRoute

    this.getDataFromRouteT(selectedRoute)
    let url = '/goo/' + this.turnament + "/" + this.routeName
    this.router.navigateByUrl(url); // Navigate to the selected route
  }
  getSeriesInfo() {
    this.apiService.getSeriesInfo(this.turnament).subscribe((res: any) => {
      this.seriesInfo = res.data
    })
  }
  userByName(index: any) {
    return index;
  }
  getupcomming() {
    this.selectedTabupcoming = true
    this.resulttab = false
    this.apiService.getUpcomingMatchesbyseries(this.turnament).subscribe((res: any) => {
      this.upcominglist = res.data
    })
  }
  getresult() {
    this.selectedTabupcoming = false
    this.resulttab = true
    this.apiService.getResultMatchesbyseries(this.turnament).subscribe((res: any) => {
      this.resultdata = res.data
    })
  }

  getneswdata(data: any) {
    this.selectedNewsTab = data
    this.apiService.getSeriesNews(this.turnament).subscribe((res: any) => {
      // this.newslist=res.data?.news
      this.latestNewsList = res.data?.sidebar?.latest
    })
  }

  popularNewsdata(data: any) {
    this.selectedNewsTab = data
    this.apiService.getSeriesNews(this.turnament).subscribe((res: any) => {
      // this.newslist=res.data?.news
      this.popularNewsList = res.data?.sidebar?.popular
    })

  }

  checkIfMobile(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 768; // Example threshold for mobile view
  }
  getrouteandCheckwidth(route: any, route1: any, id: any) {
    let url1 = route + '/' + id
    let url2 = route1 + '/' + id
    const isMobile = this.checkIfMobile();
    // Function to determine if it's mobile or not

    if (isMobile) {
      this.router.navigateByUrl(url2);
    } else {
      this.router.navigateByUrl(url1);
    }
  }

}
