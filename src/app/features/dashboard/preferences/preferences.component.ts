import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  public preferencesForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.preferencesForm = this.fb.group({
      checkRateReminderType: [''],
      radioBlock2: [''],
      radioBlock3: [''],
      radioBlock4: [''],
    });
  }

}
