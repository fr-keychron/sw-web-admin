import {Pipe, PipeTransform} from "@angular/core";
import moment from 'moment';
@Pipe({
	name: 'DatePipe'
})
export class DatePipe implements PipeTransform {
	transform(value: string, format = ''): string {
		return moment(value).format('YYYY-MM-DD');
	}
}
