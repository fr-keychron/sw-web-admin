import { HttpContext } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	OnDestroy,
	Optional,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import {
	SocialService,
} from '@delon/auth';
import { I18nPipe, MenuService } from '@delon/theme';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabChangeEvent, NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { AuthService } from '../../../service/auth/auth.service';
import { sessionStorage } from '../../../service/storage';

@Component({
	selector: 'passport-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less'],
	providers: [SocialService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		I18nPipe,
		NzCheckboxModule,
		NzTabsModule,
		NzAlertModule,
		NzFormModule,
		NzInputModule,
		NzButtonModule,
		NzToolTipModule,
		NzIconModule,
	],
})
export class UserLoginComponent {
	constructor(
		private fb: FormBuilder,
		private router: Router,
		@Optional()
		@Inject(ReuseTabService)
		private reuseTabService: ReuseTabService,
		private authService: AuthService,
		private startupSrv: StartupService,
		private menuService: MenuService,
	) {}

	// #region fields
	form = this.fb.nonNullable.group({
		// userName: ['', [Validators.required]],
		// password: ['', [Validators.required]],
		userName: ['', [Validators.required]],
		password: ['', [Validators.required]],
		remember: [true],
	});
	error = '';
	type = 0;
	loading = false;

	count = 0;

	switch({ index }: NzTabChangeEvent): void {
		this.type = index!;
	}

	submit(): void {
		this.error = '';
		const { userName, password } = this.form.controls;
		userName.markAsDirty();
		userName.updateValueAndValidity();
		password.markAsDirty();
		password.updateValueAndValidity();
		if (userName.invalid || password.invalid) {
			return;
		}

		this.loading = true;
		this.authService
			.login({
				data: {
					userName: this.form.value.userName,
					password: this.form.value.password,
				},
			})
			.subscribe((r: any) => {
				this.reuseTabService.clear();
				this.startupSrv.load().subscribe(() => {
					sessionStorage.set('token', r.data.token)
					sessionStorage.set('menu', r.data.menu)
					this.menuService.add(r.data.menu)
					this.router.navigateByUrl('/');
				});
			});
	}
}
