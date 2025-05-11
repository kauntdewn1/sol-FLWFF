import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import PostCard from '../../components/blog/PostCard';
import Pagination from '../../components/blog/Pagination';
import { useTranslation } from '../../../hooks/useTranslation';
import config from '../../../config';

const NewsPage = ({ posts, pagination }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { page = 1 } = router.query;
  const currentPage = parseInt(page, 10);

  const startIndex = (currentPage - 1) * config.postsPerPage;
  const endIndex = startIndex + config.postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="container py-5">
        <h1>{t('news.title')}</h1>
        {currentPosts.length > 0 ? (
          <>
            <div className="row">
              {currentPosts.map((post) => (
                <div key={post.id} className="col-md-4 mb-4">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
            <Pagination pagination={pagination} />
          </>
        ) : (
          <p className="text-center">{t('common.noResults')}</p>
        )}
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  const posts = await fetchPosts();
  const sortedPosts = posts
    .filter(Boolean)
    .sort((a, b) => {
      const dateA = new Date(a.publishedDate);
      const dateB = new Date(b.publishedDate);
      return dateB - dateA;
    });

  return {
    props: {
      posts: sortedPosts,
      pagination: {
        currentPage: 1,
        totalPages: Math.ceil(sortedPosts.length / config.postsPerPage),
      },
    },
  };
}

export default NewsPage;
