
import { Injectable, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from '../environments/environment';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService implements OnInit {
  private socket: any;
  Id: any
  private url = environment.url;
  private message: string | undefined;
  private messageUpdated = new Subject<{ message: any, eventId: any }>();
  private getUpdatedData = new Subject<{ message: any, eventId: any }>();
  private getscoreupdated = new Subject<{ message: any }>();


  constructor() { }

  ngOnInit(): void {

  }

  public connectSocket() {
    this.socket = io(this.url, { transports: ['websocket'], secure: true, rejectUnauthorized: false, autoConnect: true, reconnection: true });
    this.socket.on("connect", async () => {
      this.socket.on("disconnect", (err: any) => {
        this.socket.on("connect", async () => {
          var Id = 'featured'
          if (Id) {
            this.setMatches(Id);
          }
        })
      });
    });
  }

  public setMatches = (Id: any) => {
    if (Id != undefined) {
      this.socket?.emit('Competition', Id);
    }
  }
  public getMatches = (Id: any) => {
    this.socket?.on('Matches/' + Id, (message: any) => {
      this.message = message;
      this.messageUpdated.next({
        message: this.message,
        eventId: Id
      });
    });
  }
  getUpdateMessageListner() {
    return this.messageUpdated.asObservable();
  }
  public setLiveMatchesDta(id: any) {
    this.socket.emit('Schedule', id);
  }
  public getLiveMatchesDta(id: any) {
    this.socket.on("Matches/" + id, (message: any) => {
      this.message = message
      this.getUpdatedData.next({
        message: this.message,
        eventId: id
      });

    })
  }
  getLiveMatchesUpdatedData() {
    return this.getUpdatedData.asObservable();
  }
  public setLiveScore(matchId: any) {
    this.socket.emit('LiveScore', matchId);
  }
  public getLiveScore(matchId: any) {
    this.socket.on('Score/' + matchId, (message: any) => {
      this.message = message
      this.getscoreupdated.next({
        message: this.message
      })
      // console.log(message);
    });
  }
  getLiveScoreData() {
    return this.getscoreupdated.asObservable();
  }

  public destorySocket = () => {
    this.socket?.close();
  }
}

