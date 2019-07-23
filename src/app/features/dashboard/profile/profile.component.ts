import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, NgForm, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'rente-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  membershipCtrl = new FormControl();
  filteredMemberships: Observable<string[]>;
  memberships: any = [];
  public allMemberships: any = [
    {
      value: 'INGEN_MEDLEMSKAP_INGEN_HOYERE_UTDANNING',
      label: 'Ingen medlemskap/Ingen høyere utdanning'
    },
    {
      value: 'INGEN_MEDLEMSKAP_HOYERE_UTDANNING_TILSVARENDE_BACHELOR',
      label: 'Ingen medlemskap/Høyere utdanning tilsvarende Bachelor'
    },
    {
      value: 'INGEN_MEDLEMSKAP_HOYERE_UTDANNING_TILSVARENDE_MASTER',
      label: 'Ingen medlemskap/Høyere utdanning tilsvarende Master'
    },
    {
      value: 'AKADEMIKERNE_ARKITEKTENES_FAGFORBUND',
      label: 'Akademikerne/Arkitektenes fagforbund'
    },
    {
      value: 'AKADEMIKERNE_DEN_NORSKE_LEGEFORENING',
      label: 'Akademikerne/Den norske legeforening'
    },
    {
      value: 'AKADEMIKERNE_DEN_NORSKE_TANNLEGEFORENING',
      label: 'Akademikerne/Den norske tannlegeforening'
    }
  ];

  @ViewChild('membershipInput', {static: false}) membershipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private fb: FormBuilder) {
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) => membership ? this.filter(membership) : this.allMemberships.slice()));
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      membership: '',
      income: '',
      email: ''
    });
  }

  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public updateProfile() {

  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      console.log('add', event);
      const input = event.input;
      const value = event.value;

      // if ((value || '').trim()) {
      //   this.memberships.push({
      //     value: value.trim(),
      //     label: value.trim()
      //   });
      // }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.membershipCtrl.setValue(null);
    }
  }

  remove(membership, index): void {
    this.allMemberships.push(membership);
    this.allMemberships.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
    this.memberships.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.memberships.push(event.option.value);
    this.membershipInput.nativeElement.value = '';
    this.membershipCtrl.setValue(null);
  }

  private filter(value: any): any[] {
    console.log(value);
    const filterValue = value.label ? value.label.toLowerCase() : value.toLowerCase();
    this.allMemberships = this.clearDuplicates(this.allMemberships, this.memberships);

    return this.allMemberships.filter(membership => membership.label.toLowerCase().includes(filterValue));
  }

  private clearDuplicates(array: any[], toRemoveArray: any[]) {
    for (let i = array.length - 1; i >= 0; i--) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < toRemoveArray.length; j++) {
        if (array[i] && (array[i].value === toRemoveArray[j].value)) {
          array.splice(i, 1);
        }
      }
    }

    return array;
  }
}
