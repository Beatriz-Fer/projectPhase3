import { Injectable } from '@angular/core';
import { Tweet } from './tweet';


@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor() { }

  loggedInName = localStorage.getItem('loggedInName') || '';
  loggedInEmail = localStorage.getItem('loggedInEmail') || '';
  loggedInBio = localStorage.getItem('loggedInBio') || '';
  loggedInPhoto = localStorage.getItem('loggedInPhoto') || '';

  tweets: Tweet[] = [];
  retweets: Tweet[] = [];
  likes: Tweet[] = [];

  userTweets: Tweet[] = [];
  followedTweets: Tweet[] = [];

  allTweets: Tweet[] = [];


  getTweets() {
    this.allTweets = [
      ...this.tweets,
      ...this.getDummyUserData(),
      ...this.getDummyFollowerData(),
    ];
  return this.allTweets;
  }


  addTweet(tweet: Tweet)  {
    this.tweets.unshift(tweet);
  }


  addRetweet(tweet: Tweet) {
    tweet.retweets ++;
    this.retweets.unshift(tweet);
  }

  getRetweets() {
    return this.retweets;
  }


  addLike(tweet : Tweet){
    tweet.likes++;
    this.likes.unshift(tweet);
  }

  removeLike(tweet : Tweet){
    tweet.likes--;
    this.likes = this.likes.filter(t => t !== tweet);
  }

  getLikes() {
    return this.likes;
  }



  getDummyUserData(){
    this.userTweets = [
      {
        profilePic: this.loggedInPhoto,
        author: this.loggedInName,
        email: this.loggedInEmail,
        content: 'My first tweet!',
        timestamp: new Date('2023-07-01T10:00:00'),
        likes: 8,
        comments: [],
        retweets: 0,
        commentCount: 2
      },
      {
        profilePic: this.loggedInPhoto,
        author: this.loggedInName,
        email: this.loggedInEmail,
        content: 'Just had a great day!',
        timestamp: new Date('2023-07-01T12:30:00'),
        likes: 9,
        comments: [],
        retweets: 0,
        commentCount: 2
      }
    ];
    return this.userTweets;
  }



  getDummyFollowerData(){
    this.followedTweets = [
      { 
        profilePic: "/assets/images/profile-image-1.jpg", 
        author: 'David', 
        email: 'david@gmail.com', 
        content: 'Vitae purus faucibus ornare suspendisse sed nisi lacus sed.', 
        timestamp: new Date('2023-07-01T11:15:00'), 
        likes: 5, comments:[], 
        retweets: 0, 
        commentCount:2
      },
      { 
        profilePic: "/assets/images/profile-image-3.jpg", 
        author: 'John', 
        email: 'john@gmail.com', 
        content: 'Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Neque vitae tempus quam pellentesque nec nam aliquam sem. Rutrum quisque non tellus orci ac auctor augue. ', 
        timestamp: new Date('2023-01-06T11:45:00'), 
        likes: 4, 
        comments: [], 
        retweets: 0, 
        commentCount:2
      },
      { 
        profilePic: "/assets/images/profile-image-2.png", 
        author: 'Susan', 
        email: 'susan@gmail.com', 
        content: 'Id interdum velit laoreet id donec ultrices. Vitae tempus quam pellentesque nec nam aliquam sem. ', 
        timestamp: new Date('2023-02-22T11:45:00'), 
        likes: 6, 
        comments: [], 
        retweets: 0, 
        commentCount:2
      },
      { 
        profilePic: "/assets/images/profile-image-3.jpg", 
        author: 'John', email: 'john@gmail', 
        content: 'Integer quis auctor elit sed vulputate mi sit amet mauris. Odio ut sem nulla pharetra. In aliquam sem fringilla ut morbi tincidunt augue interdum. Sit amet mauris commodo quis imperdiet massa tincidunt.', 
        timestamp: new Date('2023-03-13T11:45:00'), 
        likes: 7, 
        comments: [],  
        retweets: 0, 
        commentCount:2
      },
      { 
        profilePic: "/assets/images/profile-image-2.png", 
        author: 'Susan', 
        email: 'susan@gmail', 
        content: 'Viverra vitae congue eu consequat ac felis donec et. Eget nunc lobortis mattis aliquam faucibus purus in massa.', 
        timestamp: new Date('2023-04-03T11:45:00'), 
        likes: 2, 
        comments: [],
        retweets: 0, 
        commentCount:2
      },
      { 
        profilePic: "/assets/images/profile-image-1.jpg", 
        author: 'David', 
        email: 'david@gmail.com',
        content: 'Adipiscing at in tellus integer feugiat scelerisque. Velit aliquet sagittis id consectetur purus ut. Duis convallis convallis tellus id interdum velit laoreet. <a href="https://google.com">https://google.com</a> @_ipsum_soos #mypurusut #mauris #habitant',
        timestamp: new Date('2023-06-03T11:45:00'), 
        likes: 6, 
        comments: [], 
        retweets: 0, 
        commentCount:2
      },    
      { 
        profilePic: "/assets/images/profile-image-1.jpg", 
        author: 'David', 
        email: 'david@gmail.com',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Iaculis eu non diam phasellus. ("Ipsum " -- <a href="https://google.com">https://google.com</a>)`, 
        timestamp: new Date('2023-07-06T11:45:00'), 
        likes: 1, 
        comments: [], 
        retweets: 0, 
        commentCount:2
      },
      { 
        profilePic: "/assets/images/profile-image-2.png", 
        author: 'Susan', 
        email: 'susan@gmail.com', 
        content: 'Vel eros donec ac odio. Consectetur adipiscing elit pellentesque habitant morbi tristique senectus.', 
        timestamp: new Date('2023-01-01T11:15:00'), 
        likes: 3, 
        comments: [], 
        retweets: 0, 
        commentCount:2
      }
    ];
    return this.followedTweets;
  }

}