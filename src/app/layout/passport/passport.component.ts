import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
	selector: 'layout-passport',
	template: `
		<div class="container">
			<div class="wrap">
				<div class="top">
					<div class="head">
						<img class="logo" src="./assets/logo-color.svg" />
						<span class="title">Keychron</span>
					</div>
					<div class="desc">
						Keychron后台管理系统
					</div>
				</div>
				<router-outlet />
			</div>
		</div>
	`,
	styleUrls: ['./passport.component.less'],
	standalone: true,
	imports: [
		RouterOutlet,
		GlobalFooterModule,
		NzIconModule,
		ThemeBtnComponent,
	],
})
export class LayoutPassportComponent implements OnInit {
	private tokenService = inject(DA_SERVICE_TOKEN);
	ngOnInit(): void {
		this.tokenService.clear();
	}
}
