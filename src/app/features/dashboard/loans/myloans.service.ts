import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyLoansService {
  private editModeSubject = new BehaviorSubject<number | null>(null);
  private inputEditSubject = new BehaviorSubject<boolean>(false);
  private reValidateFormSubject = new BehaviorSubject<boolean>(false);
  private setFormAsPristineSubject = new BehaviorSubject<boolean>(false);
  private ableToSaveSubject = new BehaviorSubject<boolean>(false);
  private buttonDisabledStateSubject = new BehaviorSubject<boolean>(true);
  private changesMadeSubject = new BehaviorSubject<boolean>(true);

  constructor() {}

  public setEditMode(index: number | null): void {
    this.editModeSubject.next(index);
  }

  public getEditMode(): number | null {
    return this.editModeSubject.value;
  }

  public loanEditIndexAsObservable(): Observable<number | null> {
    return this.editModeSubject.asObservable();
  }

  public resetEditMode(): void {
    this.editModeSubject.next(0);
  }

  public setInputEditModeOn(mode: boolean): void {
    this.inputEditSubject.next(mode);
  }

  public getInputEditModeAsObservable(): Observable<boolean> {
    return this.inputEditSubject.asObservable();
  }

  public setreValidateForm(mode: boolean): void {
    this.reValidateFormSubject.next(mode);
  }

  public getreValidateFormAsObservable(): Observable<boolean> {
    return this.reValidateFormSubject.asObservable();
  }

  public setFormAsPristine(): void {
    this.setFormAsPristineSubject.next(true);
  }

  public getFormAsPristine(): Observable<boolean> {
    return this.setFormAsPristineSubject.asObservable();
  }

  public setAbleToSave(mode: boolean): void {
    this.ableToSaveSubject.next(mode);
  }

  public getAbleToSave(): Observable<boolean> {
    return this.ableToSaveSubject.asObservable();
  }

  public setButtonDisabledState(mode: boolean): void {
    this.buttonDisabledStateSubject.next(mode);
  }

  public getButtonDisabledState(): Observable<boolean> {
    return this.buttonDisabledStateSubject.asObservable();
  }

  public setChangesMadeState(mode: boolean): void {
    this.changesMadeSubject.next(mode);
  }

  public getChangesMadeState(): Observable<boolean> {
    return this.changesMadeSubject.asObservable();
  }
}
