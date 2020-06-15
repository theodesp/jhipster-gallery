import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface IAlbum {
  id?: number;
  title?: string;
  description?: any;
  created?: string;
  user?: IUser;
}

export const defaultValue: Readonly<IAlbum> = {};
