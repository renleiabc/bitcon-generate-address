# Bitcoin generate address

This is a vite+typescript+react build that generates addresses, public keys, and private keys for BIP32, BIP44, BIP49, BIP84, and BIP141 standards in a browsing environment.

Installation dependencies

```
pnpm install
```

start

```
pnpm dev
```

The core code is located in the plugin. ts file

### Reference documents

<a href="https://github.com/bitcoinjs/bitcoinjs-lib/issues/997" target="_blank">How to generate child public keys from bip32 public key</a>

<a href="https://electrum.readthedocs.io/en/latest/xpub_version_bytes.html" target="_blank">Version bytes for BIP32 extended public and private keys</a>

<a href="https://www.npmjs.com/package/@swan-bitcoin/xpub-lib" target="_blank">Swan's Address Derivation Library</a>

<a href="https://github.com/mchalise/bitcoin-xpub-to-ypub/blob/master/convert_xpub_to_ypub.py" target="_blank">bitcoin xpub to ypub python</a>

<a href="https://github.com/bitcoinjs/bitcoinjs-lib/issues/1258" target="_blank">bitcoin xpub to ypub javascript</a>

<a href="https://iancoleman.io/bip39/" target="_blank">bip39 generate result</a>
