import { providers } from "ethers";
import * as React from "react";
import { type WalletClient, useWalletClient } from "wagmi";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner() {
  const { data: walletClient } = useWalletClient();
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : null),
    [walletClient],
  );
}
