// Modelo de denúncia
export interface Complaints {
  id: string;
  status: string,
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
