import { Component, OnInit } from '@angular/core';
import { Article } from '../shared/models/article';
import { NewsService } from '../shared/services/news.service'; 
import { ALL_NEWS } from '../shared/services/graphql';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.sass']
})
export class NewsComponent implements OnInit {
  news: Article[] = [];
  loadingNews: boolean = true;
  querySubscription: any;
  constructor(
    public newsService: NewsService,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.getNews();
  }

  getNews() {
    this.loadingNews = true;
    this.newsService.getNews().subscribe(
      response => {
        console.log('new respons')
        this.news = response.data.news;
        this.loadingNews = false;
      }, error => {
        console.error(error);
        this.loadingNews = false;
      }
    );
  }

}
