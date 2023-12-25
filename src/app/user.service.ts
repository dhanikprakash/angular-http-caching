import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { users } from './users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/users'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getUsername(searchTerm: string): Observable<users[]> {
    const url = `${this.apiUrl}?username=${searchTerm}`;
    return this.http.get<users[]>(url);
  }
}
