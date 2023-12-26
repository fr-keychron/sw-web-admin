import { GLOBAL_CONFIG } from 'src/app/config'
import {StrUtil} from "../shared/utils/str";

import { HttpHeaders } from "@angular/common/http";
export function Get(u: string) {
	return function(c: any, m: any , p: any) {
		// const raw = p.value
		p.value = function(arg: any = {}) {
			return this.http.get(GLOBAL_CONFIG.HOST + u , { params: arg.data })
		}
	}
}

export function Post(u: string , type: 'json' | 'formData' = 'json') {
	return function(c: any , m: any, p: any ) {
		p.value = function( arg: any ) {
			return this.http.post(GLOBAL_CONFIG.HOST + u , arg.data, { params: arg.param })
		}
	}
}


export function Delete(u: string) {
	return function(c: any , m: any, p: any ) {
		p.value = function( arg: any ) {
			let url = u
			if( arg.variable) {
				url = StrUtil.tmpReplace(u, arg.variable)
			}
			return this.http.delete(GLOBAL_CONFIG.HOST + url , arg.data)
		}
	}
}

export function Put(u: string) {
	return function(c: any , m: any, p: any ) {
		p.value = function( arg: any ) {
			return this.http.put(GLOBAL_CONFIG.HOST + u , arg.data)
		}
	}
}
