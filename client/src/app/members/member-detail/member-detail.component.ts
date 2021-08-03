import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  member: Member;
  activeTab = 0;
  
  constructor(
    private memberService: MemberService, 
    private accountService: AccountService,
    public messageService: MessageService,
    public presence: PresenceService,
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private toastr: ToastrService) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

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
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.activatedRoute.queryParamMap.subscribe(params => {
        const tabId = parseInt(params.get('tab'));
        if (isNaN(tabId)) return;
        this.activeTab = tabId;
      });
    }, 0)
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
    const username = this.activatedRoute.snapshot.paramMap.get('username');
    
    this.memberService.getUser(username).subscribe(
      member => {
        this.member = member
        this.galleryImages = this.getImages();
      }
    );
  }

  loadMessages() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      this.messageService.createHubConnnection(currentUser, this.member.username);
    })
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success(`You has liked ${member.knownAs}`);
    });
  }

  onTabActivated(event: TabDirective) {
    if (event.heading === 'Messages') {
      this.loadMessages();
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(tabId: number) {
    this.activeTab = tabId;
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
