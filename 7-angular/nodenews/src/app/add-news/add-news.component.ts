import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.sass']
})
export class AddNewsComponent implements OnInit {
  novicaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.novicaForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      contents: ['', Validators.required],
      keywords: this.formBuilder.array([
        new FormControl()
      ])
    });
  }

  addKeyword(): void {
    let kws = this.novicaForm.get('keywords') as FormArray;
    kws.push(new FormControl());
  }

  removeKeywordAt(i: number) {
    let kws = this.novicaForm.get('keywords') as FormArray;
    kws.removeAt(i);
  }

  // convenience getter for easy access to form fields
  get f() { return this.novicaForm.controls; }

}
