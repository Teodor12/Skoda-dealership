import { Pipe, PipeTransform } from '@angular/core';
import { MongoUser } from '../model/mongo/MongoUser';

@Pipe({
  name: 'filterAdmin',
  standalone: true
})
export class FilterAdminPipe implements PipeTransform {
  transform(users: MongoUser[]): MongoUser[] {
    return users.filter(user => user.email !== 'admin@gmail.com');
  }
}

