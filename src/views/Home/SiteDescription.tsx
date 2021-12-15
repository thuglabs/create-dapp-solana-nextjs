import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ENV } from '../../constants';

const SolanaLogo = () => (
    <svg
        width="46"
        height="35"
        xmlns="http://www.w3.org/2000/svg"
        className="inline"
    >
        <defs>
            <linearGradient
                x1="90.737%"
                y1="34.776%"
                x2="35.509%"
                y2="55.415%"
                id="a"
            >
                <stop stopColor="#00FFA3" offset="0%" />
                <stop stopColor="#DC1FFF" offset="100%" />
            </linearGradient>
            <linearGradient x1="66.588%" y1="43.8%" x2="11.36%" y2="64.439%" id="b">
                <stop stopColor="#00FFA3" offset="0%" />
                <stop stopColor="#DC1FFF" offset="100%" />
            </linearGradient>
            <linearGradient
                x1="78.586%"
                y1="39.317%"
                x2="23.358%"
                y2="59.956%"
                id="c"
            >
                <stop stopColor="#00FFA3" offset="0%" />
                <stop stopColor="#DC1FFF" offset="100%" />
            </linearGradient>
        </defs>
        <g fillRule="nonzero" fill="none">
            <path
                d="M7.256 26.713c.27-.27.64-.427 1.033-.427h35.64a.73.73 0 0 1 .517 1.247l-7.04 7.04c-.27.27-.64.427-1.034.427H.732a.73.73 0 0 1-.516-1.246l7.04-7.04Z"
                fill="url(#a)"
                transform="translate(.98)"
            />
            <path
                d="M7.256.427C7.536.157 7.907 0 8.289 0h35.64a.73.73 0 0 1 .517 1.246l-7.04 7.04c-.27.27-.64.428-1.034.428H.732a.73.73 0 0 1-.516-1.247l7.04-7.04Z"
                fill="url(#b)"
                transform="translate(.98)"
            />
            <path
                d="M37.405 13.486c-.27-.27-.64-.427-1.033-.427H.732a.73.73 0 0 0-.516 1.246l7.04 7.04c.27.27.64.428 1.033.428h35.64a.73.73 0 0 0 .517-1.247l-7.04-7.04Z"
                fill="url(#c)"
                transform="translate(.98)"
            />
        </g>
    </svg>
);

const SiteDescription = () => {
    const { publicKey } = useWallet();

    return (
        <div className="w-full text-center pt-2">
            <div className="hero">
                <div className="text-center hero-content">
                    <div>
                        <h1 className="mb-5 text-5xl font-bold">
                            Hello Solana <SolanaLogo /> World!
                        </h1>

                        <div className="max-w-md">
                            <p className="mb-5">
                                This scaffold includes awesome tools for rapid development and
                                deploy dapps to Solana: Next.JS, TypeScript, TailwindCSS,
                                Daisy UI.
                            </p>
                            <p className="mb-5">Solana wallet adapter is connected and ready to use.</p>
                            <p className="mb-5">Environment: {ENV}</p>
                            {publicKey
                                ? (
                                    <>Your address: {publicKey.toBase58()}</>
                                )
                                : (
                                    <div>
                                        <p>Wallet not connected</p>
                                        <div className='flex justify-center'>
                                            <WalletMultiButton />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SiteDescription
