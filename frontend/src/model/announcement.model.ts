import {AnnouncementVerification} from './announcement-verification.model';

export interface Announcement{
  id: number;
  uid: string;
  image: string;
  service: string;
  source: string;
  text: string;
  title: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  announcement_verification: AnnouncementVerification;
}
