import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./PostCard.module.scss";
import PublishedAt from "./PublishedAt";
import { useTranslation } from "../../hooks/useTranslation";

const PostCard = ({ post }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <Link href={`/news/${post.slug}`}>
        <h3 className={styles.title}>{post.title}</h3>
      </Link>
      <div className={styles.meta}>
        <PublishedAt date={post.publishedDate} />
        {post.author && (
          <span className={styles.author}>
            {t('news.author')}: {post.author}
          </span>
        )}
      </div>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <Link href={`/news/${post.slug}`} className={styles.readMore}>
        {t('common.readMore')}
      </Link>
    </div>
  );
};

export default PostCard;
