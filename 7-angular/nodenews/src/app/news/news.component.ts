import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../shared/models/article';
import { NewsService } from '../shared/services/news.service';
import { MessengerService } from '../shared/services/messenger.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.sass']
})
export class NewsComponent implements OnInit {
  news: Article[] = [];
  loadingNews: boolean = true;
  searchInput: FormGroup;
  queryFilter: string;

  constructor(
    private newsService: NewsService,
    private messenger: MessengerService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.searchInput = this.fb.group({
      filter: '',
    });
    // Poslusaj za spremembo prijave (odstrani/dodaj placljive novice)
    this.messenger.change.subscribe(
      () => {
        this.queryFilter = '';
        this.searchInput.controls.filter.setValue('');
        this.getNews();
      }
    );

    // Poslusaj za spremembami v iskalnem polju in jih dodaj v URL
    this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(
      input => {
        this.router.navigate([], {queryParams:{q:input.filter}, queryParamsHandling:"merge"});
      });
    
    this.route.queryParamMap.pipe(
        map((paramMap:ParamMap) => paramMap.has("q") ? paramMap.get("q") : ''),
        distinctUntilChanged()
    ).subscribe(filter => {
      this.queryFilter = filter;
      this.searchInput.controls.filter.setValue(filter);
      this.getNews();
    });
  }

  getNews() {
    this.loadingNews = true;
    this.newsService.getNews(this.queryFilter).subscribe(
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
