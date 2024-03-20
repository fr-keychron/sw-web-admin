import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Get, Post} from "../../decorator/req.decorator";
import {Observable} from "rxjs";

const api = {
	provider: 'logistics/provider',
	list: 'logistics/all',
	raw: 'logistics/all/#{p}/#{s}',
	plats: "logistics/all/plats",
	jd: "logistics/all/jd"
};

@Injectable({providedIn: 'root'})
export class LogisticsService {
	constructor(
		private readonly http: HttpClient
	) {
	}

	@Get(api.provider)
	provider(d?: Record<string, any>): Observable<any> | any {
	}

	@Get(api.list)
	list(q?: Record<string, any>): Observable<any> | any {
	}

	@Get(api.raw)
	raw(q?: Record<string, any>): Observable<any> | any {
	}

	@Post(api.list, 'formData')
	post(q: Record<string, any>): Observable<any> | any {
	}

	@Get(api.plats)
	plats(): Observable<any> | any {
	} ;

	@Get(api.jd)
	jdProvider(): Observable<any> | any {
	} ;
}
