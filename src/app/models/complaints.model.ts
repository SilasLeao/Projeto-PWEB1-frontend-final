// Modelo de denúncia
export interface Complaints {
  id: string;
  userEmail: string,
  imgUrl: string;
  title: string;
  time: string;
  info: string;
  like: number;
  dislike: number;
  hiddenText: string;
  expanded: boolean;
}
