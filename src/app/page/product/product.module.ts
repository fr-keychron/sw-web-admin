import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared';

import {CategoryComponent} from './category/category.component';
import {FirmwareComponent} from "./firmware/firmware.component";
import {ProductComponent} from "./product/product.component";
import {ProductLayoutComponent} from "./productLayout/product-layout.component";

const routes: Routes = [
	{path: 'category', component: CategoryComponent},
	{path: 'product', component: ProductComponent},
	{path: 'product/:id/layout', component: ProductLayoutComponent},
	{path: 'product/:id/firmware', component: FirmwareComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes), SharedModule],
	declarations: [CategoryComponent, ProductComponent, ProductLayoutComponent, FirmwareComponent],
	providers: [],
	exports: [],
})
export class ProductModule {
}
