import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descuentos'
})
export class DescuentosPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    // console.log(value);
    // console.log(args);
    let descuento = Math.round(value - (value * args[0]) / 100);
    return descuento;

  }

}
