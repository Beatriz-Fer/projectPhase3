import { Component, OnInit, OnDestroy } from '@angular/core';
import { Tweet } from '../tweet';
import { TweetService } from '../tweet.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy{


  userTweets: Tweet[] = [];
  likedTweets: Tweet[] = []; 
  retweetedTweets: Tweet[] = [];

  loggedInEmail: string = '';
  loggedInName: string = '';
  loggedInBio: string = '';
  loggedInPhoto: string | null = null;

  showUserTweets: boolean = true;
  showUserLikedTweets: boolean = false;
  showUserRetweets: boolean = false;

  
  activeLabel: string = 'tweets';

  followingCount = 500;

  showPopup: boolean = false;

  followButtons = [
    { label: 'Follow 1', followed: false },
    { label: 'Follow 2', followed: false },
    { label: 'Follow 3', followed: false },
    { label: 'Follow 4', followed: false }
  ];

  constructor(private tweetService: TweetService){
    
  }
  

  ngOnInit() { 

  // Retrieve the logged-in information and tweets
  this.loggedInEmail = localStorage.getItem('loggedInEmail') || '';
  this.loggedInName = localStorage.getItem('loggedInName') || '';
  this.loggedInBio = localStorage.getItem('loggedInBio') || '';
  this.loggedInPhoto = localStorage.getItem('loggedInPhoto') || '';

  const savedUserTweets = localStorage.getItem('tweets') || '';

  // Following button state and count
  const storedFollowedState = localStorage.getItem('followedState');
  const storedFollowingCount = localStorage.getItem('followingCount');

  if (storedFollowedState) {
    this.followButtons = JSON.parse(storedFollowedState);
  }

  if (storedFollowingCount) {
    this.followingCount = Number(storedFollowingCount);
  }
  

  //getting the users tweets, liked tweets and retweets based on actions took in feed page
  if (savedUserTweets) {
    this.userTweets = JSON.parse(savedUserTweets)
  .filter((tweet: { email: string, originalAuthor?: string }) => {
    return tweet.email === this.loggedInEmail && !tweet.originalAuthor;
  });
    
    this.likedTweets = JSON.parse(savedUserTweets).filter((tweet: { isLiked: boolean; }) => tweet.isLiked === true);

    this.retweetedTweets = JSON.parse(savedUserTweets)
    .filter((tweet: { email: string, originalAuthor?: string }) => {
      return tweet.email === this.loggedInEmail && tweet.originalAuthor;
    });
  }
}


ngOnDestroy(): void {
  // Save followed state and following count to browser storage
  localStorage.setItem('followedState', JSON.stringify(this.followButtons));
  localStorage.setItem('followingCount', this.followingCount.toString());
}


// Edit pop up box
openPopup() {
  this.showPopup = true;
}


// select a profile image from files
onFileSelected(event: any) {
  const file: File = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.loggedInPhoto = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}


closePopup() {
  this.showPopup = false;
}


saveChanges() {

  // Convert the loggedInPhoto to a string before storing it in localStorage
  const photoString = this.loggedInPhoto ? this.loggedInPhoto.toString() : '';
  localStorage.setItem('loggedInPhoto', photoString);

  // Perform the logic to save the changes
  localStorage.setItem('loggedInName', this.loggedInName);
  localStorage.setItem('loggedInBio', this.loggedInBio);

  // Close the popup box
  this.showPopup = false;
}


// follow button to increment or decrement following number
toggleFollow(index: number): void {
  const button = this.followButtons[index];
  button.followed = !button.followed;
  this.followingCount += button.followed ? 1 : -1;
}


isFollowed(buttonIndex: number): boolean {
  return this.followButtons[buttonIndex].followed;
}


// change content at bottom of page
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
  
