import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {Delete, Get, Post, Put} from '../../decorator/req.decorator';


const api = {
	list: 'merchandise/firmware/list' ,
	firmware: 'merchandise/firmware' ,
	del: 'merchandise/firmware/#{id}'
}

@Injectable({providedIn: 'root'})
export class FirmwareService {
	constructor(
		private readonly http: HttpClient
	) {
	}

	@Get(api.list)
	list(q?: any): Observable<any> | any {
	}

	@Post(api.firmware)
	add(d?: any): Observable< any> | any {}

	@Put(api.firmware)
	update(d?: any): Observable< any> | any {}

	@Delete(api.del)
	delete(d?: any): Observable<any> | any {}
}
