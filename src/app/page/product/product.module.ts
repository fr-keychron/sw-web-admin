import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared';

import {CategoryComponent} from './category/category.component';
import {FirmwareComponent} from "./firmware/firmware.component";
import {ProductComponent} from "./product/product.component";
import {ProductEditComponent} from "./productEdit/productEdit.component";

const routes: Routes = [
	{path: 'category', component: CategoryComponent},
	{path: 'product', component: ProductComponent},
	{path: 'product/:id/layout', component: ProductEditComponent},
	{path: 'product/:id/firmware', component: FirmwareComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes), SharedModule],
	declarations: [CategoryComponent, ProductComponent, ProductEditComponent, FirmwareComponent],
	providers: [],
	exports: [],
})
export class ProductModule {
}
