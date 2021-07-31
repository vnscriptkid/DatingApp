import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/Member';
import { Message } from 'src/app/_models/Message';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  member: Member;
  messages: Message[] = [];
  
  constructor(
    private memberService: MemberService, 
    private messageService: MessageService,
    private route: ActivatedRoute, 
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadMember();    

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        thumbnailsColumns: 4,
        imagePercent: 100,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
  }

  getImages(): NgxGalleryImage[] {
    const images: NgxGalleryImage[] = [];
    
    for (const photo of this.member.photos) {
      images.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
        type: 'image'
      })
    }

    return images;
  }
  
  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    
    this.memberService.getUser(username).subscribe(
      member => {
        this.member = member
        this.galleryImages = this.getImages();
      }
    );
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    });
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success(`You has liked ${member.knownAs}`);
    });
  }

  onTabActivated(event: TabDirective) {
    if (event.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages();
    }
  }
}
