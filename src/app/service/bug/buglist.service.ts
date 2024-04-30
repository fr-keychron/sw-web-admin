import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Get } from "../../decorator/req.decorator";
import { Observable } from "rxjs";

const api = {
    list: 'issue',
};

@Injectable({ providedIn: 'root' })
export class BugService {
    constructor(
        private readonly http: HttpClient
    ) {
    }

    @Get(api.list)
    list(d?: Record<string, any>): Observable<any> | any {
    }
}
