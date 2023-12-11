import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import {LoginGuard} from "./login-guard";
import { LayoutBasicComponent } from '../layout';

export const routes: Routes = [
	{
		path: '',
		component: LayoutBasicComponent,
		canActivate: [
			LoginGuard
		],
		canActivateChild: [],
		data: {},
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardComponent },
			{
				path: 'merchandise',
				loadChildren: () =>
					import('../page/product/product.module').then((m) => m.ProductModule),
			},
		],
	}, {
		path: '',
		loadChildren: () => import('./passport/routes').then((m) => m.routes),
	}, {
		path: 'exception',
		loadChildren: () => import('./exception/routes').then((m) => m.routes),
	},
	{ path: '**', redirectTo: 'exception/404' },
];
