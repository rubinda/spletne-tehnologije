import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../shared/models/article';
import { NewsService } from '../shared/services/news.service';
import { MessengerService } from '../shared/services/messenger.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.sass']
})
export class NewsComponent implements OnInit {
  news: Article[] = [];
  loadingNews: boolean = true;


  constructor(
    private newsService: NewsService,
    private messenger: MessengerService,
  ) {}

  ngOnInit() {
    this.getNews();
    this.messenger.change.subscribe(
      loggedIn => {
        this.news = [];
        this.getNews();
      }
    )
  }

  getNews() {
    this.loadingNews = true;
    this.newsService.getNews().subscribe(
      response => {
        this.news = response.data.news;
        this.loadingNews = false;
      }, error => {
        console.error(error);
        this.loadingNews = false;
      }
    );
  }

}
