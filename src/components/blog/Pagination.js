import React from 'react';
import Link from 'next/link';
import styles from './Pagination.module.scss';
import { useTranslation } from '../../hooks/useTranslation';

const Pagination = ({ pagination }) => {
  const { t } = useTranslation();
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={styles.pagination} aria-label="Navegação de páginas">
      <ul className={styles.list}>
        {currentPage > 1 && (
          <li>
            <Link 
              href={`/news?page=${currentPage - 1}`}
              className={styles.link}
            >
              {t('common.previous')}
            </Link>
          </li>
        )}

        {pages.map((page) => (
          <li key={page}>
            <Link
              href={`/news?page=${page}`}
              className={`${styles.link} ${
                page === currentPage ? styles.active : ''
              }`}
            >
              {page}
            </Link>
          </li>
        ))}

        {currentPage < totalPages && (
          <li>
            <Link 
              href={`/news?page=${currentPage + 1}`}
              className={styles.link}
            >
              {t('common.next')}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
