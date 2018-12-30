import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';

import { ALL_NEWS, AllNewsQueryResponse } from './graphql';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsURL = 'http://localhost:3000/graphql';
  
  constructor(private http: HttpClient,
              private apollo: Apollo) { }

  // Vrne vse novice
  getNews() {
    return this.apollo.watchQuery<AllNewsQueryResponse>({
      query: ALL_NEWS
    }).valueChanges
  }
}
