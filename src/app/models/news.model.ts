// Modelo de notícia
export interface News {
  id: string;
  imgUrl: string;
  title: string;
  time: string;
  info: string;
  like: number;
  dislike: number;
  hiddenText: string;
  expanded: boolean;
}
