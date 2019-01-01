import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NewsService } from '../shared/services/news.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.sass']
})
export class AddNewsComponent implements OnInit {
  novicaForm: FormGroup;
  saving: boolean;
  saved: boolean;
  error: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.novicaForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      contents: ['', Validators.required],
      keywords: this.formBuilder.array([]),
      isPremium: [ false ]
    });
    this.saving = false;
    this.saved = false;
    this.error = false;
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
    this.error = false;
    this.saved = false;
    this.newsService.makeNews(this.novicaForm.value)
      .subscribe(
        () => {
          //console.log(response);
          this.saved = true;
        },
        error => {
          this.error = true;
          console.error(error);
        }
      )
  }

  canDeactivate() : boolean | Observable<boolean> | Promise<boolean> {
    if (this.novicaForm.value.title == ''
        && this.novicaForm.value.isPremium == false
        && this.novicaForm.value.contents == ''
        && this.novicaForm.value.keywords.length == 0 ) {
      return true;
    } else if (this.saved) {
      return true;
    } else {
      console.log(this.novicaForm.value)
      return confirm("Želite zavreči nedokončan obrazec?");
    }
}

  // convenience getter for easy access to form fields
  get f() { return this.novicaForm.controls; }

}
