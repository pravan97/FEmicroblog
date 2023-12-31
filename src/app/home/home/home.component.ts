import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/apiService/api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  newPostForm: FormGroup;
  newCommentForm: FormGroup;
  newPostImage: File | null = null;
  showNewPostForm: boolean = false;
  currentUser: any;
  showEditPostForm = false;
  editedPostId: number | null = null;
  editForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private apiService: ApiService, private router: Router) {
    this.newPostForm = this.fb.group({
      content: ['', Validators.required],
      image: [null]
    });
    this.newCommentForm = this.fb.group({
      content: ['', Validators.required]
    });
    this.editForm = this.fb.group({
      editedPostContent: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.apiService.getPosts().subscribe((data: any[]) => {
      this.posts = data;
      this.posts.reverse()
    },
      (error) => {
        console.error("Error fetching posts:", error);
      });
    this.apiService.getUser().subscribe((data: any) => {
      this.currentUser = data;
    },
      (error) => {
        console.error("Error fetching posts:", error);
      });
    this.fetchPostsAndComments();
  }

  fetchPostsAndComments() {
    this.apiService.getPosts().subscribe((posts: any[]) => {
      this.posts = posts;
      this.posts.reverse()

      this.posts.forEach((post) => {
        this.apiService.getUsersForPost(post.user).subscribe((users: any[]) => {
          const user = users.find(user => user.id === post.user);
          post.username = user ? user.username : '';
        });
        this.apiService.getCommentsForPost(post.id).subscribe((comments: any[]) => {
          comments.forEach((comment) => {
            this.apiService.getUsersForPost(comment.user).subscribe((users: any[]) => {
              const user = users.find(user => user.id === comment.user);
              comment.username = user ? user.username : '';
            });
          });

          post.comments = comments;
        });
        this.apiService.getLikesForPost(post.id).subscribe((likes: any[]) => {

          const currentUserLike = likes.find(like => like.user === this.currentUser.id);

          post.isLiked = !!currentUserLike;;

        });
      });
    });
  }

  deletePost(postId: number): void {
    this.apiService.deletePost(postId).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== postId);
    });
  }

  handleImageInput(event: any) {
    this.newPostImage = event.target.files[0];
  }

  focusCommentInput(commentInput: HTMLTextAreaElement) {
    commentInput.focus();
  }
  //-----------------------------
  createNewPost() {
    const content = this.newPostForm.get('content')?.value;
    const userId = this.currentUser.id;
    this.apiService.newPost(content, this.newPostImage, userId).subscribe(
      (response: any) => {
        const newPost = {
          id: response.id,
          content: content,
          image: response.image,
          user: userId,
          username: this.currentUser.username,
          comments: [],
          isLiked: false
        };
        this.posts.unshift(newPost);
      })
    this.newPostForm.reset();
    this.newPostImage = null;
  }
  createNewComment(postId: number) {
    const content = this.newCommentForm.get('content')?.value;
    this.apiService.createComment(postId, content, this.currentUser.id).subscribe(
      (response: any) => {
        location.reload()

      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  toggleLike(post: any) {

    if (!post.isLiked) {
      this.apiService.createLike(this.currentUser.id, post.id).subscribe(
        (response: any) => {
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.apiService.removeLike(post.id).subscribe(
        (response: any) => {
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
    post.isLiked = !post.isLiked;
  }

  toggleNewPostForm() {
    this.showNewPostForm = !this.showNewPostForm;
    if (!this.showNewPostForm) {
      this.newPostForm.reset();
      this.newPostImage = null;
    }
  }
  logout() {

    sessionStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }


  toggleEditPostForm(post: any) {
    this.showEditPostForm = !this.showEditPostForm;
    this.editedPostId = post.id;
  }

  editPost(post: any) {
    this.toggleEditPostForm(post);
  }

  updatePost() {
    const content = this.editForm.get('editedPostContent')?.value;
    if (this.editedPostId) {
      this.apiService.updatePost(this.editedPostId, content).subscribe(
        response => {
         location.reload();
        },
        error => {
          // Handle error
        }
      );
      this.showEditPostForm = false;
      this.editedPostId = null;
    }
  }
}
