import React from 'react';
import Layout from '../../../components/layout';
import PublishedAt from '../../../components/blog/PublishedAt';
import styles from './Post.module.scss';
import { builder, BuilderComponent, useIsPreviewing } from "@builder.io/react";
import NotFoundPage from "../404";
import customComponentsRegistration from "@/utils/customComponentGenerator";
import {
  getAllPostSlugs,
  getPostAndMorePosts,
  getPageSettings,
} from "@/lib/builder/api";
import { NEWS_BUILDER_CONFIG } from "@/lib/builder/news/constants";
import { MetaData } from "@/components/blog/meta";
import { DetailsHero } from "@solana-foundation/solana-lib";
import { PageBreadcrumbs } from "@/components/developers/DevelopersContentPage/PageBreadcrumbs";

builder.apiVersion = "v3";
customComponentsRegistration();

/**
 * Single post view (/:slug)
 *
 * This file renders a single post and loads all the content.
 *
 */
const PostPage = ({ builderLocale, post, pageSettings }) => {
  const newsPostData = post?.data;
  const postSlug = `/news/${newsPostData?.slug}` || "/news";

  const postTitle = newsPostData?.title || "Please Enter a Title";
  const featuredImage = newsPostData?.image || "/src/img/news/blogbackup.png";
  const authorName = newsPostData?.author?.value?.name || "Solana Foundation";
  const publishedDate = newsPostData?.datePublished;
  const isPreviewing = useIsPreviewing();

  if (!post && !isPreviewing) {
    return <NotFoundPage />;
  }

  return (
    <>
      <MetaData settings={pageSettings} data={{ builderPost: post }} />
      <Layout>
        <PageBreadcrumbs
          className="d-none"
          breadcrumbs={[{ label: "News", href: "/news" }]}
        />

        <DetailsHero
          title={postTitle}
          image={featuredImage}
          author={{ name: authorName }}
          publishedDate={publishedDate}
          shareIcons
          slug={postSlug}
        />
        <article className={styles.post}>
          <div className="container py-5">
            <header className={styles.header}>
              <h1 className={styles.title}>{postTitle}</h1>
              <PublishedAt date={publishedDate} />
            </header>
            {featuredImage && (
              <div className={styles.imageContainer}>
                <img 
                  src={featuredImage} 
                  alt={postTitle}
                  className={styles.image}
                />
              </div>
            )}
            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: newsPostData?.content }} 
            />
          </div>
        </article>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const allPosts = await getAllPostSlugs(NEWS_BUILDER_CONFIG.postsModel);
  const paths = allPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  try {
    let slug = params?.slug || "";

    if (!slug) {
      return { notFound: true };
    }

    // sometimes links will contain a URL encoded character at the end (as exposed by Sentries).
    // make an effort to remove those so that the user doesnt get a 404
    // real example: 9-14-network-outage-initial-overview%22
    slug = slug.replace(/(%\d+)+$/, "");

    let { post, morePosts } = await getPostAndMorePosts(
      NEWS_BUILDER_CONFIG.postsModel,
      slug,
      builderLocale,
    );

    const [pageSettings] = await Promise.all([getPageSettings()]);

    return {
      props: {
        builderLocale,
        key: post?.id + post?.data.slug + params.slug,
        post: post || null,
        pageSettings,
        morePosts,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export default PostPage;
