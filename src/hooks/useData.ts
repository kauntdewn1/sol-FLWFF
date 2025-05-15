import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useData<T>(url: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
} 