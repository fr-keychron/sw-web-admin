import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Get, Post } from '../../decorator/req.decorator';


const api = {
	login: 'auth/login',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
	constructor(private readonly http: HttpClient) {
	}

	@Post(api.login)
	login(d: Record<string, any>): Observable<any> | any {}
}
