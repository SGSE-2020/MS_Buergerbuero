import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAnnouncementUser'
})
export class FilterAnnouncementUserPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    const list = items.filter(item => item.uid === filter);
    return list;
  }
}
