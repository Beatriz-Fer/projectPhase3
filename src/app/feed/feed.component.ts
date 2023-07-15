import { Component, OnInit, OnDestroy } from '@angular/core';
import { Tweet } from '../tweet';
import { TweetService } from '../tweet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  tweets: Tweet[] = [];

  loggedInName!: string; 
  loggedInEmail!: string; 
  loggedInBio: string = '';
  loggedInPhoto: string = '';

  newTweetContent: string = '';

  activeTweet: any = null;

  searchQuery: string = '';

  constructor(private tweetService: TweetService, private router: Router) {  
  }


  ngOnInit() {
    // Retrieve the logged-in user from local storage
    this.loggedInName = localStorage.getItem('loggedInName') || '';
    this.loggedInEmail = localStorage.getItem('loggedInEmail') || ''; 
    this.loggedInBio = localStorage.getItem('loggedInBio') || '';
    this.loggedInPhoto = localStorage.getItem('loggedInPhoto') || '';

    this.getTweets();

    // Retrieve the tweets from local storage when the component is initialized
    this.retrieveTweetsFromLocalStorage();
    
     // Retrieve the comments from local storage 
    this.retrieveCommentsFromLocalStorage();   

  }


  ngOnDestroy() {
    // Save the comments to local storage when the component is destroyed (user leaves the page)
    this.saveCommentsToLocalStorage();

     // Save the tweets to local storage
    this.saveTweetsToLocalStorage();

    window.location.reload();

  }


  retrieveTweetsFromLocalStorage() {
    const savedTweets = localStorage.getItem('tweets');
    if (savedTweets) {
      const parsedTweets = JSON.parse(savedTweets);
      this.tweets = parsedTweets.map((tweet: Tweet) => {
        // Check if the logged-in user has changed their name/ profile pic
        if (tweet.email === this.loggedInEmail) {
          tweet.author = this.loggedInName;
          tweet.profilePic = this.loggedInPhoto;
        }
        return tweet;
      });
    }
  }


  retrieveCommentsFromLocalStorage() {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      const parsedComments = JSON.parse(savedComments);
      this.tweets.forEach((tweet, index) => {
        tweet.comments = parsedComments[index] || []; // empty array if comments are undefined
        tweet.commentCount = (tweet.comments?.length || 0) + 2; // updates comment count
      });
    }
  }


 logout() {
    // Clears the comments, likes and retweets
    this.tweets.forEach((tweet) => {
      tweet.comments = [];
      tweet.commentCount = 0;
      tweet.retweets = 0;
      tweet.isLiked = false;
      tweet.likes--;
    });

    this.getTweets();

    // Save the updated comments to local storage
    this.saveCommentsToLocalStorage();

    // Clear the local storage
    localStorage.clear();

    // Refresh page to mimic closing the application
    window.location.href = '/';

    this.router.navigate(['/register']);
  }
  


  private getTweets() {
    // getting the retweets, likes and dummy tweets
    const tweets = this.tweetService.getTweets();
    const retweets = this.tweetService.getRetweets();
    const likes = this.tweetService.getLikes();
  
    const likedTweetContents = likes.map(tweet => tweet.content);
     
    // Combine the user and followed tweets
    this.tweets = [
      ...tweets.filter(tweet => !likedTweetContents.includes(tweet.content)),
      ...retweets,
      ...likes
    ];
  
    // Sort the tweet order
    this.tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }


  // save tweets to local storage
  private saveTweetsToLocalStorage() {
    localStorage.setItem('tweets', JSON.stringify(this.tweets));
   
  }


  searchTweets() {
    // Perform the search based on the searchQuery
    const filteredTweets = this.tweets.filter((tweet) => {
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      const lowerCaseContent = tweet.content.toLowerCase();
      const lowerCaseAuthor = tweet.author.toLowerCase();
      return lowerCaseContent.includes(lowerCaseQuery) || lowerCaseAuthor.includes(lowerCaseQuery);
    });

    // Update the tweets with the filtered results
    this.tweets = filteredTweets;

    // Reset the search if search query is empty
    if (this.searchQuery === '') {
      this.resetSearch();
    }
  }

  // reset the search
  resetSearch() {
    this.searchQuery = '';
    this.getTweets();
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
        retweets: 0, 
        commentText: '',
        commentCount: 2
      };
  
      // Add the new tweet to the beginning of the tweets array
      this.tweets.unshift(tweet);
  
      // Add the new tweet to the tweet service
      this.tweetService.addTweet(tweet);

      // Clear the tweet input field
      this.newTweetContent = '';

      // Save the tweets to local storage after adding a new tweet
      this.saveTweetsToLocalStorage();
      this.tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
  }


  // when the liked button is clicked
  toggleLike(tweet: Tweet) {

    if (tweet.isLiked) {
      this.tweetService.removeLike(tweet); 
    } else {
      this.tweetService.addLike(tweet);
    }
    tweet.isLiked = !tweet.isLiked;

    // Save the liked tweets to local storage after 
    this.saveTweetsToLocalStorage();
    this.tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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


  // writing a comment
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
  
      // Store the updated comments in local storage
      this.saveCommentsToLocalStorage();
    }
  }
  private saveCommentsToLocalStorage() {
    localStorage.setItem('comments', JSON.stringify(this.tweets.map(tweet => tweet.comments)));
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
      originalDate: tweet.timestamp,
      retweets: 0, 
      commentCount: 2
    };
    
    this.tweets.unshift(retweetedTweet);

    tweet.retweets ++;

    // Add the new tweet to the tweet service
    this.tweetService.addRetweet(retweetedTweet);

    // Save the tweets to local storage after adding a new tweet
    this.saveTweetsToLocalStorage();
    this.tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

 
}
  
