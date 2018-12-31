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

export const MAKE_NEWS = gql`
  mutation insertArticle($title: String!, $contents: String!, $subscriptionType: String!, $keywords: [String]!) {
    insertArticle(title: $title, contents: $contents, subscriptionType: $subscriptionType, keywords: $keywords) {
      id
    }
  }
`

export interface MakeNewsResponse {
  id: string;
}

export interface AllNewsQueryResponse {
  news: Article[];
  loading: boolean;
}