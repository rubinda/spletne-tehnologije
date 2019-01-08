import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { ALL_NEWS, AllNewsQueryResponse, MakeNewsResponse, 
  MAKE_NEWS, NEWS_FROM_AUTHOR, AuthorArticlesResponse } from './graphql';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsURL = 'http://localhost:3000/graphql';
  
  constructor(private apollo: Apollo) { }

  // Vrne vse novice
  getNews(filter: string) {
    return this.apollo.watchQuery<AllNewsQueryResponse>({
      query: ALL_NEWS,
      variables: {
        filterText: filter
      },
      fetchPolicy: 'network-only',
    }).valueChanges;
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

  getNewsByAuthor(username: string) {
    return this.apollo.watchQuery<AuthorArticlesResponse>({
      query: NEWS_FROM_AUTHOR,
      variables: {
        username,
      },
      fetchPolicy: 'network-only',
    }).valueChanges;
  }
}
