import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  modalRef: BsModalRef;
  
  constructor(private modalService: BsModalService) { }

  confirm(
      title='Confirmation', 
      message='Are you sure to do this',
      okButton='OK', 
      cancelButton='Cancel'
  ) : Observable<boolean> {
    const initialState = {
      title, message, okButton, cancelButton
    }
    
    this.modalRef = this.modalService.show(ConfirmDialogComponent, { initialState })
    
    return new Observable<boolean>((observer) => {
      const sub = this.modalService.onHidden.subscribe(() => {
        observer.next(this.modalRef.content.result);
        observer.complete();
      });

      return { unsubscribe: () => sub.unsubscribe() }
    }) 
  }
}
