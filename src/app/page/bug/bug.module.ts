import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared';

import {BugListComponent} from './bugList/bug-list.component';

const routes: Routes = [
	{path: 'list', component: BugListComponent},
];

@NgModule({
	imports: [RouterModule.forChild(routes), SharedModule],
	declarations: [BugListComponent],
	providers: [],
	exports: [],
})
export class BugModule {
}
