import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {Delete, Get, Post, Put} from '../../decorator/req.decorator';

const api = {
	category: 'merchandise/category' ,
	categoryAll: 'merchandise/category/all' ,
	categoryDel: 'merchandise/category/#{id}',
	product: 'merchandise/product',
	productJson: 'merchandise/product/json',
	productInfoByVpId: 'merchandise/product/vpId/#{id}',
	productDel: 'merchandise/product/#{id}'
}

@Injectable({providedIn: 'root'})
export class ProductService {

	static VpId(vendorId: number, productId: number) {
		return vendorId * 65536 + productId;
	}
	constructor(
		private http: HttpClient
	) {
	}

	@Get(api.category)
	categoryList(q?: any): Observable<any> | any {
	}

	@Get(api.categoryAll)
	categoryAll(q?: any): Observable<any> | any {
	}

	@Post(api.category)
	categoryAdd(d: any): Observable<any> | any {
	} ;

	@Put(api.category)
	categoryUpdate(d: any): Observable<any> | any {
	} ;

	@Delete(api.categoryDel)
	categoryDel(d: any): Observable<any> | any {}


	@Get(api.product)
	productList(d?: any): Observable<any> | any {

	}

	@Post(api.product)
	productAdd(d?: any): Observable< any > | any {}

	@Delete(api.productDel)
	productDel(d: any): Observable<any> | any {}


	@Put(api.product)
	productUpdate(d?: any): Observable< any > | any {}

	@Put(api.productJson)
	productUpdateJson(d?: any): Observable< any > | any {}

	@Get(api.productInfoByVpId)
	productInfoByVpId(d?: any):  Observable< any > | any {}
}
