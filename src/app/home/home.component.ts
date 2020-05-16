import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  response:any;

  getLatestTrack: any;

  messageToBox: any;

  latestNews: any;

  news:any;

  constructor( private http: HttpClient ) { }

  ngOnInit() {

    this.getCurrentTrack();

    this.getLatestNews();

    setInterval(() => {  this.getCurrentTrack()  }, 60 * 1000); // 60 * 1000 milsec

  }

  getCurrentTrack(){
    this.getLatestTrack = this.http.get('https://hazel.torontocast.com:3110/api/v2/history/?limit=1&offset=0&server=1');
    this.getLatestTrack.subscribe((response) => {
     this.response = response;
    }, (err) => {
      if (err.status = "404") {
        this.messageToBox = {message: 'Something went wrong'};
      }
    });
  };


  getLatestNews(){
    this.latestNews = this.http.get('https://newsapi.org/v2/everything?sources=entertainment-weekly&apiKey=a4010e4b77384d91acd53b3fd75aefa8');
    this.latestNews.subscribe((news) => {
     this.news = news.articles;
    }, (err) => {
      if (err.status = "404") {
        this.messageToBox = {message: 'Something went wrong'};
      }
    });
  };

}
