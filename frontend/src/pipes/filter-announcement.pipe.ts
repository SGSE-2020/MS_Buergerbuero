import { Pipe, PipeTransform } from '@angular/core';
import {JsonObject} from '@angular/compiler-cli/ngcc/src/packages/entry_point';

@Pipe({
  name: 'filterAnnouncement'
})
export class FilterAnnouncementPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    const list = items.filter(item => item.type === filter);
    return list;
  }
}
