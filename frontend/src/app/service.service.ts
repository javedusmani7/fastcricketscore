import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
// import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  // CompetitionUrl="http://localhost:3000/api/competetions?token=ad3749cfdb0cceb518412cf46"
  // sportUrl= "http://localhost:3000/api/seasons?token=ad3749cfdb0cceb518412cf46ef9e44a";
  // baseUrl= 'http://192.46.214.33:3000/api/data'
  baseUrl = environment.baseUrl;
  token=environment.token
  sendLoggedData: BehaviorSubject<any> = new BehaviorSubject('abc')
  sendLoggedData1 = new Subject<any>()
  sendLoggedData2 = new Subject<any>()
  sendLoggedData3 = new Subject<any>()
  callCommon = new Subject<any>()
  sendPrivacy = new Subject<any>()
  getheader = new Subject<any>()


  private countListenter = new Subject<any>();
  usersData: any;
  loginFlag: any;
  eventData: any;
  checkInterval: any
  intervalSubscription: any;
  loggedIn = false
  seriesMatchData: BehaviorSubject<any> = new BehaviorSubject({})
  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.getUpcomingMatches()

  }

  getCompetitionData() : Observable<any>{

    let competition = this.http.get(`${this.baseUrl}/competetions?token=${this.token}`);
    return competition
  }

  getSportData_OLD(): Observable<any>{
    let resultTest=  this.http.get(`${this.baseUrl}/seasons?token=${this.token}`);
    return resultTest
  }

  getSportData() {
    return this.http.get(`${this.baseUrl}/seasons?token=${this.token}`)
  }

  getCricketMenus() {
    return this.http.get(`${this.baseUrl}/getCricketMenu/`)
  }


  getCricketMainTabs() {
    return this.http.get(`${this.baseUrl}/getCricketMainTabs/`)
  }


  getCricketMatches(data: any) {
    return this.http.get(`${this.baseUrl}/getCricketMatches/` + data)
  }

  getLiveMatches() {
    return this.http.get(`${this.baseUrl}/getLiveMatches/`)
  }

  getCommentary(match_id:any){
  return this.http.get(`${this.baseUrl}/matchLive?token=${this.token}&match_id=${match_id}`)

 
  }

  getUpcomingMatches() {
    return this.http.get(`${this.baseUrl}/getUpcomingMatches/`)
  }
  getResultMatches() {
    return this.http.get(`${this.baseUrl}/getResultMatches/`)
  }
  getPointsTable(data: any) {
    return this.http.get(`${this.baseUrl}/getPointsTable/` + data)
  }
  getUpcomingMatchesbyseries(data: any) {
    // console.log(data, "getUpcomingMatchesbyseries");

    return this.http.get(`${this.baseUrl}/getUpcomingMatches/` + data)
  }
  getLiveMatchesbyseries(data: any) {
    console.log(data, "getLiveMatchesbyseries");

    return this.http.get(`${this.baseUrl}/getLiveMatches/` + data)
  }
  getResultMatchesbyseries(data: any) {
    console.log(data, "getResultMatchesbyseries");

    return this.http.get(`${this.baseUrl}/getResultMatches/` + data)
  }

  getCricketSeries() {
    return this.http.get(`${this.baseUrl}/getCricketSeries`)
  }
  getLiveCricketScore(matchId: any) {
   let data=this.http.get(`${this.baseUrl}/matchScorecard?token=${environment.token}&match_id=${matchId}`)
  //  console.log("data " , data)
   return data
  }

  getInfoCricket(matchId: any) {
    return this.http.get(`${this.baseUrl}/competetionMatches?token=${environment.token}&match_id=${matchId}`)
   
  }
  getMatchSquads(matchId: any) {
    return this.http.get(`${this.baseUrl}/matchSquads?token=${environment.token}&match_id=${matchId}`)
   
  }
  getInfoCricketScores(matchId: any) {
    return this.http.get(`${this.baseUrl}/competetionMatches?token=${environment.token}&match_id=${matchId}`)
   
  }
  getFantasyData(matchId: any) {
    return this.http.get(`${this.baseUrl}/matchFantasy?token=${environment.token}&match_id=${matchId}`)
   
  }
  getSeriesMostRuns(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMostRuns/` + tournament_slug)
  }
  getSeriesMostwickets(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMostwickets/` + tournament_slug)
  }
  getSeriesMost4s(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMost4s/` + tournament_slug)
  }
  getSeriesMost6s(tournament_slug: any) {
    console.log(tournament_slug, "tournament_slug");

    return this.http.get(`${this.baseUrl}/getSeriesMost6s/` + tournament_slug)
  }
  getSeriesHighestStrikeRate(tournament_slug: any) {
    // console.log(tournament_slug, "getSeriesHighestStrikeRate");

    return this.http.get(`${this.baseUrl}/getSeriesHighestStrikeRate/` + tournament_slug)
  }
  getSeriesHighestIndividualScore(tournament_slug: any) {

    return this.http.get(`${this.baseUrl}/getSeriesHighestIndividualScore/` + tournament_slug)
  }
  getSeriesMostFifties(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMostFifties/` + tournament_slug)
  }
  getSeriesMostHundreds(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMostHundreds/` + tournament_slug)
  }

  getSeriesBestEconomy(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesBestEconomy/` + tournament_slug)
  }

  getSeriesMostMaidens(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMostMaidens/` + tournament_slug)
  }

  getSeriesBestBowlingFigures(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesBestBowlingFigures/` + tournament_slug)
  }

  getSeriesMost4wickets(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMost4wickets/` + tournament_slug)
  }

  getSeriesMost5wickets(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesMost5wickets/` + tournament_slug)
  }

  getSeriesBestBowlingStrikeRate(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesBestBowlingStrikeRate/` + tournament_slug)
  }

  getUpcomingMatchesBySeries(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getUpcomingMatches/` + tournament_slug)
  }

  getResultMatchesBySeries(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getResultMatches/` + tournament_slug)
  }

  getSeriesInfo(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesInfo/` + tournament_slug)
  }

  getSeriesStats(tournament_slug: any) {
    return this.http.get(`${this.baseUrl}/getSeriesStats/` + tournament_slug)
  }

  loadCommentryData(tournament_slug: any,timestamp:any){
    return this.http.get(`${this.baseUrl}/getCommentry?id=${tournament_slug}&timestamp=${timestamp}`)
  }
  getIccRanking(){
    return this.http.get(`${this.baseUrl}/getIccRanking`)
  }

  // http://192.46.214.33:3000/api/data/getPlayerInfo/shubman-gill

  getPlayerInfo(id: any) {
    return this.http.get(
      `${this.baseUrl}/playerProfile?token=${environment.token}&pid=${id}`
    );
  }
  getPlayerStats(id: any) {
    return this.http.get(
      `${this.baseUrl}/playerStatstic?token=${environment.token}&pid=${id}`
    );
  }

  // http://192.46.214.33:3000/api/data/getIccRanking/icc-odi-ranking
  getIccRankingapis(name:any){
    // console.log(name);

    return this.http.get(`${this.baseUrl}/getIccRanking/${name}`)
  }


  callCommonCompo(data : any){
    this.callCommon.next(data)
  }



  getTeamInfo(name:any){
    // console.log(name);
    return this.http.get(`${this.baseUrl}/getTeamInfo/${name}`)
  }

  getTeamSquad(name:any){
    return this.http.get(`${this.baseUrl}/getTeamSquad/${name}`)
  }

  getLatestNews(){
    return this.http.get(`${this.baseUrl}/getHomeNews`)
  }

  getSeriesNews(tournament_slug:any){
    return this.http.get(`${this.baseUrl}/getSeriesNews/${tournament_slug}`)
  }

  getHomeSidebarNews(){
    return this.http.get(`${this.baseUrl}/getHomeSidebarNews`)
  }

  getTeamUpcomingMatches(team_slug:any){
    return this.http.get(`${this.baseUrl}/getTeamUpcomingMatches/${team_slug}`)
  }

  getTeamResultMatches(team_slug:any){
    return this.http.get(`${this.baseUrl}/getTeamResultMatches/${team_slug}`)
  }

  getSKNewsDetail(link:any){
    return this.http.get(`${this.baseUrl}/getSKNewsDetail/${link}`)
  }

  getteamNews(team_slug:any){
    return this.http.get(`${this.baseUrl}/getteamNews/${team_slug}`)
  }

  getPlayerNews(player_slug:any){
    return this.http.get(`${this.baseUrl}/getPlayerNews/${player_slug}`)
  }

  getTeamLastnNextMatch(team_slug:any){
    return this.http.get(`${this.baseUrl}/getTeamLastnNextMatch/${team_slug}`)
  }
  getHomeSidebarStat(){
    return this.http.get(`${this.baseUrl}/getHomeSidebarStat`)
  }
  // http://192.46.214.33:3000/api/data/getSeriesOrangeCap/ipl
  getSeriesOrangeCap(tournament_slug:any){
    return this.http.get(`${this.baseUrl}/getSeriesOrangeCap/${tournament_slug}`)
  }
  // http://192.46.214.33:3000/api/data/getSeriesPurpleCap/ipl
  getSeriesPurpleCap(tournament_slug:any){
    return this.http.get(`${this.baseUrl}/getSeriesPurpleCap/${tournament_slug}`)
  }



}

