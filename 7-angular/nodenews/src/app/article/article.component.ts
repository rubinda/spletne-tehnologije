import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../shared/models/article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass'] 
})
export class ArticleComponent implements OnInit {
  @Input() article: Article

  constructor() { }

  ngOnInit() {
  }

}
