import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NewsService } from '../shared/services/news.service';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.sass']
})
export class AddNewsComponent implements OnInit {
  novicaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.novicaForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      contents: ['', Validators.required],
      keywords: this.formBuilder.array([
        new FormControl('', [Validators.required, Validators.maxLength(30)])
      ]),
      isPremium: [false]
    });
  }

  addKeyword(): void {
    let kws = this.novicaForm.get('keywords') as FormArray;
    kws.push(new FormControl('', [Validators.required, Validators.maxLength(30)]));
  }

  removeKeywordAt(i: number) {
    let kws = this.novicaForm.get('keywords') as FormArray;
    kws.removeAt(i);
  }

  postArticle() {
    this.newsService.makeNews(this.novicaForm.value)
      .subscribe(
        response => {
          console.log(response);
        }
      )
  }

  // convenience getter for easy access to form fields
  get f() { return this.novicaForm.controls; }

}
