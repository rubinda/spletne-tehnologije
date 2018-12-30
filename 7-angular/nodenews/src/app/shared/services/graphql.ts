import gql from 'graphql-tag';
import { Article } from '../models/article';

// Backend handla ali dobimo free ali free + premium novice
export const ALL_NEWS = gql`query {
  news {
    title
    contents
    createdAt
    keywords
    author {
      givenName
      familyName
    }
  }
}`

export interface AllNewsQueryResponse {
  news: Article[];
  loading: boolean;
}