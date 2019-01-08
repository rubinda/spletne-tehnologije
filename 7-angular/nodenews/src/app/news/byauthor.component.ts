import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../shared/services/news.service';
import { Article } from '../shared/models/article';

@Component({
  selector: 'app-byauthor',
  templateUrl: './byauthor.component.html',
  styleUrls: ['./byauthor.component.sass']
})
export class ByauthorComponent implements OnInit {
  private authorUsername: string;
  private articlesFromAuthor: Article[] = [];

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        if (params['a']) {
          this.authorUsername = params['a']
          this.getArticleTitles();
        } else {
          this.authorUsername = ''
        }
      }
    );
  }

  getArticleTitles() {
    this.newsService.getNewsByAuthor(this.authorUsername).subscribe(
      response => {
        this.articlesFromAuthor = response.data.newsFromAuthor;
      }
    )
  }

}
