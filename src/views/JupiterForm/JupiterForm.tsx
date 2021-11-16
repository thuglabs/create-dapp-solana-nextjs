import * as React from "react";
import { TokenListProvider, TokenInfo, ENV } from "@solana/spl-token-registry";
import { useJupiter, RouteInfo, TransactionFeeInfo } from "@jup-ag/react-hook";
import { PublicKey } from "@solana/web3.js";
import styles from "./JupiterForm.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
interface IJupiterFormProps {}

type UseJupiterProps = Parameters<typeof useJupiter>[0];

const JupiterForm: React.FunctionComponent<IJupiterFormProps> = (props) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [tokenMap, setTokenMap] = React.useState<Map<string, TokenInfo>>(
    new Map()
  );

  const [formValue, setFormValue] = React.useState<UseJupiterProps>({
    amount: 0,
    inputMint: undefined,
    outputMint: undefined,
    slippage: 0,
  });

  const [inputTokenInfo, outputTokenInfo] = React.useMemo(() => {
    return [
      tokenMap.get(formValue.inputMint?.toBase58() || ""),
      tokenMap.get(formValue.outputMint?.toBase58() || ""),
    ];
  }, [formValue.inputMint?.toBase58(), formValue.outputMint?.toBase58()]);

  React.useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens.filterByChainId(ENV.MainnetBeta).getList();

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
    });
  }, [setTokenMap]);

  const amountInDecimal = React.useMemo(() => {
    return formValue.amount * 10 ** (inputTokenInfo?.decimals || 1);
  }, [inputTokenInfo, formValue.amount]);

  const { routeMap, allTokenMints, routes, loading, exchange, error } =
    useJupiter({
      ...formValue,
      amount: amountInDecimal,
    });

  const validOutputMints = React.useMemo(
    () => routeMap.get(formValue.inputMint?.toBase58() || "") || allTokenMints,
    [routeMap, formValue.inputMint?.toBase58()]
  );

  // setup inputMint and outputMint
  React.useEffect(() => {
    if (!formValue.inputMint && allTokenMints.length) {
      const input = allTokenMints[0];
      const output = routeMap.get(input)![0];
      setFormValue((val) => ({
        ...val,
        inputMint: new PublicKey(allTokenMints[0]),
        outputMint: new PublicKey(output),
      }));
    }
  }, [allTokenMints]);

  // ensure outputMint can be swapable to inputMint
  React.useEffect(() => {
    if (formValue.inputMint) {
      const possibleOutputs = routeMap.get(formValue.inputMint.toBase58());

      if (
        possibleOutputs &&
        !possibleOutputs?.includes(formValue.outputMint?.toBase58() || "")
      ) {
        setFormValue((val) => ({
          ...val,
          outputMint: new PublicKey(possibleOutputs[0]),
        }));
      }
    }
  }, [formValue.inputMint?.toBase58(), formValue.outputMint?.toBase58()]);

  return (
    <div>
      <div className="mb-2">
        <label htmlFor="inputMint" className="block text-sm font-medium">
          Input token
        </label>
        <select
          id="inputMint"
          name="inputMint"
          className="mt-1 bg-neutral block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={formValue.inputMint?.toBase58()}
          onChange={(e) => {
            setFormValue((val) => ({
              ...val,
              inputMint: new PublicKey(e.currentTarget.value),
            }));
          }}
        >
          {allTokenMints.map((tokenMint) => {
            return (
              <option key={tokenMint} value={tokenMint}>
                {tokenMap.get(tokenMint)?.name || "unknown"}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-2">
        <label htmlFor="outputMint" className="block text-sm font-medium">
          Output token
        </label>
        <select
          id="outputMint"
          name="outputMint"
          className="mt-1 bg-neutral block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={formValue.outputMint?.toBase58()}
          onChange={(e) => {
            setFormValue((val) => ({
              ...val,
              outputMint: new PublicKey(e.currentTarget.value),
            }));
          }}
        >
          {validOutputMints.map((tokenMint) => {
            return (
              <option key={tokenMint} value={tokenMint}>
                {tokenMap.get(tokenMint)?.name || "unknown"}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Input Amount ({inputTokenInfo?.symbol})
        </label>
        <div className="mt-1">
          <input
            name="amount"
            id="amount"
            className="shadow-sm bg-neutral p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={formValue.amount}
            type="text"
            pattern="[0-9]*"
            onInput={(e: any) => {
              let newValue = Number(e.target?.value || 0);
              newValue = Number.isNaN(newValue) ? 0 : newValue;
              setFormValue((val) => ({
                ...val,
                amount: Math.max(newValue, 0),
              }));
            }}
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <div
            className={`${styles.loader} ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24`}
          ></div>
          loading...
        </div>
      )}

      {!loading && (
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          type="button"
        >
          Refresh rate
        </button>
      )}

      <div>Total routes: {routes?.length}</div>

      {routes?.[0] &&
        (() => {
          const route = routes[0];
          return (
            <div>
              <div>
                Best route info :{" "}
                {route.marketInfos.map((info) => info.marketMeta.amm.label)}
              </div>
              <div>
                Output:{" "}
                {route.outAmount / 10 ** (outputTokenInfo?.decimals || 1)}{" "}
                {outputTokenInfo?.symbol}
              </div>
              <FeeInfo route={route} />
            </div>
          );
        })()}

      {error && <div>Error in Jupiter, try changing your intpu</div>}

      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          if (
            !loading &&
            routes?.[0] &&
            wallet.signAllTransactions &&
            wallet.signTransaction &&
            wallet.sendTransaction &&
            wallet.publicKey
          ) {
            const swapResult = await exchange({
              wallet: {
                sendTransaction: wallet.sendTransaction,
                publicKey: wallet.publicKey,
                signAllTransactions: wallet.signAllTransactions,
                signTransaction: wallet.signTransaction,
              },
              route: routes[0],
              confirmationWaiterFactory: async (txid) => {
                console.log("sending transaction");
                await connection.confirmTransaction(txid);
                console.log("confirmed transaction");

                return await connection.getTransaction(txid, {
                  commitment: "confirmed",
                });
              },
            });

            console.log({ swapResult });

            if ("error" in swapResult) {
              console.log("Error:", swapResult.error);
            } else if ("txid" in swapResult) {
              console.log("Sucess:", swapResult.txid);
              console.log("Input:", swapResult.inputAmount);
              console.log("Output:", swapResult.outputAmount);
            }
          }
        }}
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Swap Best Route
      </button>
    </div>
  );
};

const FeeInfo: React.FC<{ route: RouteInfo }> = ({ route }) => {
  const [state, setState] = React.useState<TransactionFeeInfo>();
  React.useEffect(() => {
    setState(undefined);
    route.getDepositAndFee().then(setState);
  }, [route]);
  return (
    <div>
      {state && (
        <div>
          <br />
          Deposit For serum: {/* In lamports */}
          {state.openOrdersDeposits.reduce((total, i) => total + i, 0) /
            10 ** 9}{" "}
          SOL
          <br />
          Deposit For ATA: {/* In lamports */}
          {state.ataDeposit / 10 ** 9} SOL
          <br />
          Fee: {/* In lamports */}
          {state.signatureFee / 10 ** 9} SOL
          <br />
        </div>
      )}
    </div>
  );
};

export default JupiterForm;
