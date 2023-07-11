import { Component, OnInit } from '@angular/core';
import { Tweet } from '../tweet';
import { TweetService } from '../tweet.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  tweets: Tweet[] = [];

  loggedInName!: string; 
  loggedInEmail!: string; // '!' operator to indicate it will be initialized
  loggedInBio: string = '';
  loggedInPhoto: string = '';

  newTweetContent: string = '';

  activeTweet: any = null;

  constructor(private tweetService: TweetService) {
  }


  ngOnInit() {
    // Retrieve the logged-in user from local storage
    this.loggedInName = localStorage.getItem('loggedInName') || '';
    this.loggedInEmail = localStorage.getItem('loggedInEmail') || ''; 
    this.loggedInBio = localStorage.getItem('loggedInBio') || '';
    this.loggedInPhoto = localStorage.getItem('loggedInPhoto') || '';

    this.getTweets();
  }

  
  private getTweets() {
    // Combine the user and followed tweets
    this.tweets = [...this.tweetService.getTweets(), ...this.tweetService.getRetweets(),...this.tweetService.getLikes()];
    // sort the tweet order
    this.tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  
  createTweet() {
    // Check if the tweet content is not empty and within the character limit
    if (this.newTweetContent && this.newTweetContent.length <= 280) {
      const tweet: Tweet = {
        profilePic: this.loggedInPhoto,
        author: this.loggedInName,
        email: this.loggedInEmail,
        content: this.newTweetContent,
        timestamp: new Date(),
        likes: 0,
        comments: [],
        retweets: 0, // Initialize retweets count to 0
        commentText: '',
        commentCount: 2
      };
  
      // Add the new tweet to the beginning of the tweets array
      this.tweets.unshift(tweet);
  
      // Add the new tweet to the tweet service
      this.tweetService.addTweet(tweet);

      // Clear the tweet input field
      this.newTweetContent = '';
    }
  }


  toggleLike(tweet: Tweet) {

    if (tweet.isLiked) {
      this.tweetService.removeLike(tweet); 
    } else {
      this.tweetService.addLike(tweet);
    }
    tweet.isLiked = !tweet.isLiked;
  }


  // comment pop up box
  toggleTextBox(tweet: any) {
    if (this.activeTweet === tweet) {
      this.activeTweet = null;
    } else {
      this.activeTweet = tweet;
    }
   }


  closePopup() {
    this.activeTweet = null;
  }


  submitText(tweet: Tweet) {
    if (this.activeTweet.commentText) {
      if (!tweet.comments) {
        tweet.comments = [];
      }
      tweet.comments.push(this.activeTweet.commentText);
      this.activeTweet.commentText = '';

      const tweetIndex = this.tweets.findIndex(t => t === tweet);
      if (tweetIndex !== -1) {
        this.tweets[tweetIndex].commentCount += 1;
        this.tweets[tweetIndex].isCommented = true;
      }
    }
  }


  retweet(tweet: Tweet) {
    // Create a new tweet object based on the original tweet
    const retweetedTweet: Tweet = {
      profilePic: this.loggedInPhoto,
      author: this.loggedInName,
      email: this.loggedInEmail,
      content: tweet.content,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      originalAuthor: tweet.author, // Add the original author to the retweeted tweet
      retweets: 0, 
      commentCount: 2
    };
    
    this.tweets.unshift(retweetedTweet);
    tweet.retweets ++;

    // Add the new tweet to the tweet service
    this.tweetService.addRetweet(retweetedTweet);
  }

 
}
  
