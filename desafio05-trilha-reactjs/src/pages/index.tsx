import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';

import Image from 'next/image';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  apiRef?: string;
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [loadedPosts, setLoadedPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadMore(): Promise<void> {
    const prismic = getPrismicClient();
    const postsResponse = await fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        setNextPage(data.next_page);
        return data.results;
      })
      .catch(err => {
        console.error(err);
      });

    const results = postsResponse.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setLoadedPosts([...loadedPosts, ...results]);
  }

  return (
    <>
      <main className={styles.container}>
        {loadedPosts.map(post => (
          <div key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <h2>{post.data.title}</h2>
            </Link>
            <p>{post.data.subtitle}</p>
            <div>
              <span>
                <AiOutlineCalendar />
                <span>
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    { locale: ptBR }
                  )}
                </span>
              </span>
              <span>
                <FiUser />
                <span>{post.data.author}</span>
              </span>
            </div>
          </div>
        ))}
        {nextPage && (
          <button type="button" onClick={handleLoadMore}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    { fetch: ['posts.title', 'posts.subtitle', 'posts.author'], pageSize: 1 }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
    },
  };
};
