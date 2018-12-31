import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';

import { ALL_NEWS, AllNewsQueryResponse, MakeNewsResponse, MAKE_NEWS } from './graphql';
import { Article } from '../models/article';

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
      query: ALL_NEWS,
      fetchPolicy: 'network-only',
    }).valueChanges
  }

  // Ustvari zapis o novici
  makeNews(form: any) {
    let subscriptionType = "free";
    if (form.isPremium) {
      subscriptionType = "premium";
    }
    return this.apollo.mutate<MakeNewsResponse>({
      mutation: MAKE_NEWS,
      variables: {
        title: form.title,
        contents: form.contents,
        keywords: form.keywords,
        subscriptionType,
      }
    });
  }
}
