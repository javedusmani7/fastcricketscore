import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';
// import { FindComponent } from './find/find.component';
import { HomeComponent } from './home/home.component';
import { FantasyComponent } from './fantasy/fantasy.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  // { path: "find", component: FindComponent },
  { path: "cricket-schedule",loadChildren:()=>import('./cricket-shedule/cricket-shedule.module').then(el=>el.CricketSheduleModule) },
  { path: "series", loadChildren: () => import('./series/series.module').then(el => el.SeriesModule) },
  { path: "news/:event_slug/:path", loadChildren: () => import('./news/news.module').then(el => el.NewsModule) },
  { path: "news", loadChildren: () => import('./news/news.module').then(el => el.NewsModule) },
  { path: "pointTable/:event_slug", loadChildren:()=>import('./points-table/point-table.module').then(el =>el.PointsTableModule)},
  { path: "team/:teamName", loadChildren: () => import('./team/team.module').then(el => el.TeamModule) },
  { path: "child-shedule/:event_slug/:routes",loadChildren:()=>import('./child-shedule/child-shedule.module').then(el =>el.ChildSheduleModule)},
  { path: "go/:event_slug", loadChildren: () => import('./go/go.module').then(el => el.GoModule) },
  { path: "stats/:event_slug", loadChildren: () => import('./stats/stats.module').then(el => el.StatsModule) },
  { path: "squad/:id", loadChildren: () => import('./squad/squad.module').then(el => el.SquadModule) },
  { path: "scorecard/:id", loadChildren: () => import('./scorecard/scorecard.module').then(el => el.ScorecardModule) },
  { path: "live/:id", loadChildren: () => import('./live/live.module').then(el => el.LiveModule) },
  {path:"goo/:event_slug/:stricks",loadChildren:()=>import('./commonpage/commonpage.module').then(el =>el.CommonpageModule)},
  {path:"livecricket-score/:id",loadChildren:()=>import('./match-center/match-center.module').then(el => el.MatchCenterModule)},
  {path:"stat/:event_slug",loadChildren:()=>import('./mobile/statmobile/statMobile.module').then(el =>el.StatmobileModule)},
  {path:"live-cricket-score/:id" ,loadChildren:()=> import('./mobile/allscorsdata/allScoreData.module').then(el => el.AllScoreDataModule)},
  {path:"iccRanking/:rankingName",loadChildren:()=>import('./icc-ranking/icc-ranking.module').then(el => el.IccRankingModule)},
  {path:"about-us",loadChildren:()=>import('./about-us/about-us.module').then(el => el.AboutUsModule)},
  {path:"player/:playerId",loadChildren:()=>import('./player/player.module').then(el => el.PlayerModule)},
  {path:"ranking/:rankingName",loadChildren:()=>import('./mobile/mobile-ranking/mobile-ranking.module').then(el => el.MobileRankingModule)},
  {path:"cricket-news/:link",loadChildren:()=>import('./news-detail/news-detail.module').then(el => el.NewsDetailModule)},
  { path: "fantasy/:id", component: FantasyComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
