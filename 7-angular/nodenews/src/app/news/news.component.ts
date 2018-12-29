import { Component, OnInit } from '@angular/core';
import { Article } from '../shared/models/article';
import { NewsService } from '../shared/services/news.service'; 

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.sass']
})
export class NewsComponent implements OnInit {
  news: Article[] = [
    {
      author: 'David Rubin', 
      title: 'David uspesno ustvaril prvo novico', 
      contents: 'Davidu je uspelo ustvariti novo novico in jo prikazati na frontendu preko locenih komponent', 
      keywords: ['angular', '#dela', '#ne-diraj'], 
      createdAt: new Date(), 
      subscriptionType: false,
    },
    {
      author: 'Chantal Ackermann', 
      title: 'Lorem ipsum', 
      contents: 'Lorem ipsum dolor sit amet, id quis quando maiestatis nec, populo mollis ornatus ius ex. Eam et vidit fierent cotidieque, vero convenire tractatos eu nec. Ei veritus maiorum vim. Has partem repudiandae ea, etiam everti ius ei. Fabulas scriptorem pri ut, ea mel quas platonem.', 
      keywords: ['lorem', '#chanti-no5'], 
      createdAt: new Date(), 
      subscriptionType: false,
    },
  ];

  constructor(
    public newsService: NewsService
  ) { }

  ngOnInit() {
  }

}
