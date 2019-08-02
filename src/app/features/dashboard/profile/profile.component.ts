import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, NgForm, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith, mergeMap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material';
import { LoansService } from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';

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
  public allMemberships: any[];

  @ViewChild('membershipInput', {static: false}) membershipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private userService: UserService
    ) {
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) => membership ? this.filter(membership) : this.allMemberships.slice()));
  }

  ngOnInit() {
    this.loansService.getMembershipTypes().pipe(
      mergeMap((memberships: any) => {
        this.allMemberships = memberships;
        return this.loansService.getUsersMemberships();
      })
    ).subscribe((userMemberships: any) => {

      this.memberships = this.allMemberships.filter(membership => {
        if (userMemberships.memberships.includes(membership.name)) {
          return membership;
        }
      });

      forkJoin(this.userService.getUserInfo(), this.loansService.getAddresses()).subscribe(data => {
        console.log(data[0]);
        const userData = data[0];
        const addressData = data[1];
        this.profileForm = this.fb.group({
          membership: userMemberships.memberships,
          income: userData.income,
          email: userData.email
        });
      });

    });
  }

  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public updateProfile() {
    const userData = {
      email:  this.profileForm.value.email,
      income: null
    };
    this.userService.updateUserInfo(userData).subscribe(res => {
      console.log(res);
    });
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
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
    this.allMemberships.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    this.memberships.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.memberships.push(event.option.value);
    this.membershipInput.nativeElement.value = '';
    this.membershipCtrl.setValue(null);
  }

  private filter(value: any): any[] {
    const filterValue = value.label ? value.label.toLowerCase() : value.toLowerCase();
    this.allMemberships = this.clearDuplicates(this.allMemberships, this.memberships);

    return this.allMemberships.filter(membership => membership.label.toLowerCase().includes(filterValue));
  }

  private clearDuplicates(array: any[], toRemoveArray: any[]) {
    for (let i = array.length - 1; i >= 0; i--) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < toRemoveArray.length; j++) {
        if (array[i] && (array[i].name === toRemoveArray[j].name)) {
          array.splice(i, 1);
        }
      }
    }

    return array;
  }
}
