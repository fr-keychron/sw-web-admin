import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';

import {DatePipe} from "./pipe/date.pipe";
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { CommonHeaderComponent } from '../component/common-header/common-header.component';
import {EnumPipe} from "./pipe/enum.pipe";
import {UploadFile} from "./pipe/uploadFile.pipe";
import {LoginGuard} from "../routes/login-guard";

// #region third libs

const THIRDMODULES: Array<Type<void>> = [];

// #endregion

// #region your componets & directives

const COMPONENTS: Array<Type<void>> = [CommonHeaderComponent];
const DIRECTIVES: Array<Type<void>> = [];
const PIPES: Array<Type<void>> =[
	DatePipe,
	EnumPipe,
	UploadFile
]
// #endregion

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		AlainThemeModule,
		DelonACLModule,
		DelonFormModule,
		...SHARED_DELON_MODULES,
		...SHARED_ZORRO_MODULES,
		// third libs
		...THIRDMODULES,
	],
	providers: [
	],
	declarations: [
		// your components
		...COMPONENTS,
		...DIRECTIVES,
		...PIPES
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		AlainThemeModule,
		DelonACLModule,
		DelonFormModule,
		...SHARED_DELON_MODULES,
		...SHARED_ZORRO_MODULES,
		// third libs
		...THIRDMODULES,
		// your components
		...COMPONENTS,
		...DIRECTIVES,
		...PIPES,

	],
})
export class SharedModule {}
