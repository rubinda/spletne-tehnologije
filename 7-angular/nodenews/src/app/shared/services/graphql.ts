import gql from 'graphql-tag';
import { Article } from '../models/article';

// Backend handla ali dobimo free ali free + premium novice
export const ALL_NEWS = gql`
  query AllNewsQuery($filterText: String) {
    news (filter: $filterText){
      title
      contents
      createdAt
      keywords
      author {
        givenName
        familyName
        username
      }
    }
  }`;

export const MAKE_NEWS = gql`
  mutation insertArticle($title: String!, $contents: String!, $subscriptionType: String!, $keywords: [String]!) {
    insertArticle(title: $title, contents: $contents, subscriptionType: $subscriptionType, keywords: $keywords) {
      id
    }
  }`;

export const NEWS_FROM_AUTHOR = gql`
  query NewsFromAuthorQuery($username: String!){
    newsFromAuthor(username: $username) {
      title
      createdAt
    }
  }`;

export interface MakeNewsResponse {
  id: string;
}

export interface AuthorArticlesResponse {
  newsFromAuthor: Article[];
}

export interface AllNewsQueryResponse {
  news: Article[];
  loading: boolean;
}