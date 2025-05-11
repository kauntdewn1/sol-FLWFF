export const languages = {
  'pt-BR': {
    name: 'Português',
    code: 'pt-BR',
    flag: '🇧🇷',
  },
  'en': {
    name: 'English',
    code: 'en',
    flag: '🇺🇸',
  },
};

export const defaultLanguage = 'pt-BR';

export const getLanguageFromPath = (path) => {
  const firstSegment = path.split('/')[1];
  return Object.keys(languages).includes(firstSegment) ? firstSegment : defaultLanguage;
};

export const getPathWithoutLanguage = (path) => {
  const segments = path.split('/');
  const firstSegment = segments[1];
  
  if (Object.keys(languages).includes(firstSegment)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return path;
};

export const getLocalizedPath = (path, language) => {
  const pathWithoutLanguage = getPathWithoutLanguage(path);
  
  if (language === defaultLanguage) {
    return pathWithoutLanguage;
  }
  
  return `/${language}${pathWithoutLanguage}`;
};

export const translations = {
  'pt-BR': {
    common: {
      readMore: 'Ler mais',
      previous: 'Anterior',
      next: 'Próxima',
      search: 'Buscar',
      noResults: 'Nenhum resultado encontrado',
      loading: 'Carregando...',
      error: 'Ocorreu um erro',
    },
    news: {
      title: 'Notícias',
      latest: 'Últimas notícias',
      featured: 'Destaques',
      categories: 'Categorias',
      all: 'Todas',
      readArticle: 'Ler artigo',
      publishedAt: 'Publicado em',
      author: 'Autor',
      share: 'Compartilhar',
    },
  },
  'en': {
    common: {
      readMore: 'Read more',
      previous: 'Previous',
      next: 'Next',
      search: 'Search',
      noResults: 'No results found',
      loading: 'Loading...',
      error: 'An error occurred',
    },
    news: {
      title: 'News',
      latest: 'Latest news',
      featured: 'Featured',
      categories: 'Categories',
      all: 'All',
      readArticle: 'Read article',
      publishedAt: 'Published on',
      author: 'Author',
      share: 'Share',
    },
  },
}; 