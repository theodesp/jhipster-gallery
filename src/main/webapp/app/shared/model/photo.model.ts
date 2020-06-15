import { Moment } from 'moment';
import { IAlbum } from 'app/shared/model/album.model';
import { ITag } from 'app/shared/model/tag.model';

export interface IPhoto {
  id?: number;
  title?: string;
  description?: any;
  imageContentType?: string;
  image?: any;
  height?: number;
  width?: number;
  taken?: string;
  uploaded?: string;
  album?: IAlbum;
  tags?: ITag[];
}

export const defaultValue: Readonly<IPhoto> = {};
