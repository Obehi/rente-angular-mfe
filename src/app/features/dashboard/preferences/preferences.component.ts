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
      checkRateReminderType: [1],
      radioBlock2: [true],
      radioBlock3: [true],
      radioBlock4: [true],
    });
  }

  public updatePreferances() {}

}
