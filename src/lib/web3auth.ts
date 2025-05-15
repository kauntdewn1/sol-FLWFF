import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

// Configuração do provedor de chave privada
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

// Inicialização do provedor de chave privada
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
});

// Configuração do Web3Auth
export const web3auth = new Web3Auth({
  clientId,
  chainConfig,
  web3AuthNetwork: "sapphire_mainnet",
  enableLogging: true,
});

// Configuração do adaptador OpenLogin
const openloginAdapter = new OpenloginAdapter({
  privateKeyProvider,
  adapterSettings: {
    whiteLabel: {
      name: "FLWFF",
      logoLight: "https://res.cloudinary.com/dgyocpguk/image/upload/v1747195425/LOGO_Sfundo1_yn3irt.png",
      logoDark: "https://res.cloudinary.com/dgyocpguk/image/upload/v1747195425/LOGO_Sfundo1_yn3irt.png",
      defaultLanguage: "pt",
      mode: "dark",
    },
    loginConfig: {
      jwt: {
        name: "Custom JWT Login",
        verifier: "flwff-verifier",
        typeOfLogin: "jwt",
        clientId: clientId,
      },
    },
  },
});

// Adiciona o adaptador ao Web3Auth
web3auth.configureAdapter(openloginAdapter);

// Função para inicializar o Web3Auth
export const initWeb3Auth = async () => {
  try {
    await web3auth.initModal();
    return web3auth;
  } catch (error) {
    console.error("Erro ao inicializar Web3Auth:", error);
    throw error;
  }
};

// Função para obter o provedor
export const getProvider = async (): Promise<SafeEventEmitterProvider | null> => {
  if (!web3auth) {
    console.log("Web3Auth não está inicializado");
    return null;
  }
  return web3auth.provider;
}; 