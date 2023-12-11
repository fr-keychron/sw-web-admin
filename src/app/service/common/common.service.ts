import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Post} from "../../decorator/req.decorator";


@Injectable({ providedIn: "root"})
export class  CommonService{
	constructor(
		private http: HttpClient
	) {
	}

	@Post('common/upload/cover', 'formData')
	uploadCover(f: any): Observable<any> | any {}

	@Post('common/upload/bin', 'formData')
	uploadBin(f: any): Observable<any> | any {}
}
