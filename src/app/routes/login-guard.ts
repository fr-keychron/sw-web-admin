
import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from '@angular/router';

import {sessionStorage} from "../service/storage";

@Injectable({ providedIn: "root" })
export class LoginGuard implements CanActivate {
	constructor(
		private readonly router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		const token = sessionStorage.get('token')

		if (token) {
			return true;
		}
		this.router.navigate(['/passport/login']);
		return false;
	}
}
