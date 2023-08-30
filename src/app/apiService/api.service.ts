import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<any[ ]>(`${this.baseUrl}rest/posts/`);
  }

  getCommentsForPost(postId: number) {
    return this.http.get<any>(`${this.baseUrl}rest/comments/?post_id=${postId}`);
  }

  getLikesForPost(postId: number) {
    return this.http.get<any>(`${this.baseUrl}rest/likes/?post_id=${postId}`);
  }
  getUsersForPost(postuser: number) {
    const token = sessionStorage.getItem('access_token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}auth/all-users/`);
  }
  deletePost(postId: number) {
    return this.http.delete(`${this.baseUrl}rest/posts/${postId}/`);
  }

  newPost(content: string, image: File | null, userId: number) {
    const postData = new FormData();
    postData.append('content', content);
    if (image) {
      postData.append('image', image);
    }
    postData.append('user', userId.toString());

    return this.http.post<any>(`${this.baseUrl}rest/posts/`, postData);
  }
  createComment(postId: number, content: string, user: number){
    const commentData = {
      post: postId,
      content: content,
      user: user 
    };

    return this.http.post<any>(`${this.baseUrl}rest/comments/`, commentData);
  }
  createLike(postUser: number, postId: number){
    const commentData = {
      user: postUser, 
      post: postId
    };
    console.log(commentData);

    return this.http.post<any>(`${this.baseUrl}rest/likes/`, commentData);
  }

  removeLike(postId: number) {
    return this.http.delete(`${this.baseUrl}rest/likes/delete_by_post/?post_id=${postId}`);
  }

  register(data: string){
    const header = new HttpHeaders().set('Content-type', 'application/json');
    const body = JSON.parse(data)
    return this.http.post(`${this.baseUrl}auth/users/`, body);
  }

  login(password: string, email: string){
    const body = {
      password: password,
      username: email
    };    console.log(body)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}auth/token/`, body,{headers: headers});
  }
  getUser() {
    const token = sessionStorage.getItem('access_token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}auth/me/`,{headers:headers});
  }
}