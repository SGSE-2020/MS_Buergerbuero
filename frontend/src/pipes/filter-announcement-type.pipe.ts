import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAnnouncementType'
})
export class FilterAnnouncementTypePipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    const list = items.filter(item => item.type === filter);
    return list;
  }
}
