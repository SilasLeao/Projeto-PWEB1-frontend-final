// Modelo de notícia
export interface News {
  id: string;
  imgUrl: string;
  title: string;
  time: string;
  info: string;
  likes: number;
  dislikes: number;
  hiddenText: string;
  expanded: boolean;
}
