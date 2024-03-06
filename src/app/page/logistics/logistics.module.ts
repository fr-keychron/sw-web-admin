import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared';
import {ListComponent} from "./list/list.component";
import {PlatComponent} from "./plat/plat.component";

const routes: Routes = [
	{path: 'list', component: ListComponent},
	{path: 'plat/:p/:s', component: PlatComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes), SharedModule],
	declarations: [
		ListComponent,
		PlatComponent
	],
	providers: [],
	exports: [],
})
export class LogisticsModule {
}
