import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsURL = 'http://localhost:3000/graphql';

  constructor(private http: HttpClient) { }
}
