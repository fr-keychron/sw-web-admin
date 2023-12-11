import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import {
	LayoutDefaultModule,
	LayoutDefaultOptions,
} from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { environment } from '@env/environment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { HeaderClearStorageComponent } from './widgets/clear-storage.component';
import { HeaderFullScreenComponent } from './widgets/fullscreen.component';
import { HeaderSearchComponent } from './widgets/search.component';
import { HeaderUserComponent } from './widgets/user.component';

@Component({
	selector: 'layout-basic',
	template: `
		<layout-default
			[options]="options"
			[content]="contentTpl"
			[customError]="null"
		>
			<layout-default-header-item direction="left" hidden="mobile">
				<a
					layout-default-header-item-trigger
					routerLink="/passport/lock"
				>
					<i nz-icon nzType="lock"></i>
				</a>
			</layout-default-header-item>
			<layout-default-header-item direction="left" hidden="pc">
				<div
					layout-default-header-item-trigger
					(click)="searchToggleStatus = !searchToggleStatus"
				>
					<i nz-icon nzType="search"></i>
				</div>
			</layout-default-header-item>
			<layout-default-header-item direction="right" hidden="mobile">
				<div
					layout-default-header-item-trigger
					nz-dropdown
					[nzDropdownMenu]="settingsMenu"
					nzTrigger="click"
					nzPlacement="bottomRight"
				>
					<i nz-icon nzType="setting"></i>
				</div>
				<nz-dropdown-menu #settingsMenu="nzDropdownMenu">
					<div nz-menu style="width: 200px;">
						<div nz-menu-item>
							<header-fullscreen />
						</div>
						<div nz-menu-item>
							<header-clear-storage />
						</div>
					</div>
				</nz-dropdown-menu>
			</layout-default-header-item>
			<ng-template #contentTpl>
				<router-outlet />
			</ng-template>
		</layout-default>
	`,
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,
		I18nPipe,
		LayoutDefaultModule,
		SettingDrawerModule,
		ThemeBtnComponent,
		NzIconModule,
		NzMenuModule,
		NzDropDownModule,
		NzAvatarModule,
		HeaderSearchComponent,
		HeaderClearStorageComponent,
		HeaderFullScreenComponent,
		HeaderUserComponent,
	],
})
export class LayoutBasicComponent {
	private readonly settings = inject(SettingsService);
	options: LayoutDefaultOptions = {
		logoExpanded: `./assets/logo-full.svg`,
		logoCollapsed: `./assets/logo.svg`,
	};
	searchToggleStatus = false;
	showSettingDrawer = !environment.production;

	get user(): User {
		return this.settings.user;
	}
}
