import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'dot'})
export class DotPipe implements PipeTransform {
    transform(value: number) {
        value.toString
        return value.toString().replace(".", ",")
    }
}