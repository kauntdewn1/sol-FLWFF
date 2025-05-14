import type { FC } from 'react';

interface PriceData {
  [id: string]: {
    usd: number;
  };
}

interface PriceDisplayProps {
  tokenGeckoId: string;
  tokenSymbol: string;
}

async function getPrice(tokenId: string): Promise<number | null> {
  try {
    // Note: This is a server-side fetch. For true real-time, client-side fetching with interval is needed.
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!response.ok) {
      console.error('Failed to fetch price from CoinGecko:', response.statusText);
      return null;
    }
    const data: PriceData = await response.json();
    return data[tokenId]?.usd ?? null;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}

const PriceDisplay: FC<PriceDisplayProps> = async ({ tokenGeckoId, tokenSymbol }) => {
  const price = await getPrice(tokenGeckoId);

  return (
    <div className="p-6 bg-card border border-secondary/30 rounded-lg shadow-2xl flex flex-col items-center justify-center min-h-[150px]">
      {price !== null ? (
        <>
          <span className="font-mono text-5xl md:text-7xl text-secondary" style={{ textShadow: '0 0 5px hsl(var(--secondary)), 0 0 10px hsl(var(--secondary)), 0 0 15px hsl(var(--secondary)), 0 0 20px hsl(var(--secondary))' }}>
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
          <span className="text-lg text-muted-foreground mt-1">USD por ${tokenSymbol}</span>
        </>
      ) : (
        <span className="font-mono text-3xl text-destructive animate-pulse">
          PREÇO INDISPONÍVEL
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
