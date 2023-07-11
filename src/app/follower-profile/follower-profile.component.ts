import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-follower-profile',
  templateUrl: './follower-profile.component.html',
  styleUrls: ['./follower-profile.component.css']
})
export class FollowerProfileComponent implements OnInit, OnDestroy {

followerName!: string;
followerEmail!: string;
followerPhoto!: string;
followerId!: string;

showUserTweets: boolean = true;
showUserLikedTweets: boolean = false;
showUserRetweets: boolean = false;

activeLabel: string = 'tweets';

followingCount = 500;

followButtons = [
  { label: 'Follow 1', followed: false },
  { label: 'Follow 2', followed: false },
  { label: 'Follow 3', followed: false },
  { label: 'Follow 4', followed: false }
];

loggedInEmail: string = '';
loggedInName: string = '';
loggedInBio: string = '';
loggedInPhoto: string = '';

constructor(private route: ActivatedRoute) {}

ngOnInit() {

   // Retrieve the logged-in info 
   this.loggedInEmail = localStorage.getItem('loggedInEmail') || '';
   this.loggedInName = localStorage.getItem('loggedInName') || '';
   this.loggedInBio = localStorage.getItem('loggedInBio') || '';
   this.loggedInPhoto = localStorage.getItem('loggedInPhoto') || '';

  this.route.params.subscribe(params => {
    this.followerName = params['name'];
    this.followerEmail = params['email'];
    this.followerPhoto = params['photo'];
    this.followerId = params['id'];

    // Following
  const storedFollowedState = localStorage.getItem('followedState');
  const storedFollowingCount = localStorage.getItem('followingCount');

  
  if (storedFollowedState) {
    this.followButtons = JSON.parse(storedFollowedState);
  }

  if (storedFollowingCount) {
    this.followingCount = Number(storedFollowingCount);
  }
  
  });

}

ngOnDestroy(): void {
  // Save followed state and following count to browser storage
  localStorage.setItem('followedState', JSON.stringify(this.followButtons));
  localStorage.setItem('followingCount', this.followingCount.toString());
}


toggleFollow(followerId: number): void {
  const button = this.followButtons[followerId];
  button.followed = !button.followed;
  this.followingCount += button.followed ? 1 : -1;
}


isFollowed(buttonIndex: number): boolean {
  return this.followButtons[buttonIndex].followed;
}


changeContent(label: string) {
  this.activeLabel = label;
}


showTweets() {
  this.showUserTweets = true;
  this.showUserLikedTweets = false;
  this.showUserRetweets = false;
}

showLikedTweets() {
  this.showUserTweets = false;
  this.showUserLikedTweets = true;
  this.showUserRetweets = false;
}

showRetweets() {
  this.showUserTweets = false;
  this.showUserLikedTweets = false;
  this.showUserRetweets = true;
}

}
