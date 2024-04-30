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
			},{
				path: 'logistics',
				loadChildren: () =>
					import('../page/logistics/logistics.module').then((m) => m.LogisticsModule),
			},{
				path: 'bug',
				loadChildren: () =>
					import('../page/bug/bug.module').then((m) => m.BugModule),
			}
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
