import {Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({providedIn: 'root'})
export class MsgService {
	constructor(
		private nzMessageService: NzMessageService
	) {
	}

	warn(s: string) {
		this.nzMessageService.warning(s)
	}

	error(s: string) {
		this.nzMessageService.error(s)
	}

	success(s: string ) {
		this.nzMessageService.success(s)
	}
}
