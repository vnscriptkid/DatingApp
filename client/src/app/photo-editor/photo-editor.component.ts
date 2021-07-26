import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';
import { Photo } from '../_models/Photo';
import { User } from '../_models/User';
import { AccountService } from '../_services/account.service';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: Member;

  baseUrl = `${environment.apiUrl}/users/add-photo`;

  hasBaseDropZoneOver:boolean;
  uploader: FileUploader;
  user: User;
  
  constructor(private accountService: AccountService, private memberService: MemberService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.initializeUploader();
  }

  ngOnInit(): void {
  }

  fileOverBase(event: any): void {
    this.hasBaseDropZoneOver = event;
  }

  setMainPhoto(photo: Photo): void {
    this.memberService.setMainPhoto(photo).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.member.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl,
      authToken: `Bearer ${this.user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: false,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    }
  }
}

