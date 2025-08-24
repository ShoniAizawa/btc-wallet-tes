# bitcoin wallet test

1. install dependencies

```
npm install
```

2. run the wallet, if not present a bip32 wallet will be generated:
```
npm start
```

## development roadmap
- sweep private key
- multisig transactions
- hardware wallet integration
  - trezor
  - ledger
  - coldcard
- lightning integration




# Dokumentasi Tes Coding: Sweep Private Key untuk Bitcoin Wallet

## Overview
Tes ini fokus pada pengembangan fitur **sweep private key** untuk Bitcoin wallet berbasis Node.js, seperti yang tercantum di roadmap proyek[](https://github.com/gianlucamazza/nodejs-bitcoin-wallet). Tujuannya adalah memindahkan semua dana dari private key ke alamat tujuan dengan aman dan efisien, sambil menangani edge cases dan meminimalkan fee transaksi.

## Problem Statement
- **Input**: Private key (format WIF), alamat tujuan (P2PKH/P2WPKH), dan akses ke blockchain data (via API).
- **Output**: Transaksi yang memindahkan semua dana ke alamat tujuan, dengan fee yang sesuai.
- **Constraints**:
  - Harus validasi private key.
  - Handle edge cases: saldo nol, private key invalid, fee terlalu rendah.
  - Optimalkan fee untuk efisiensi.

## Approach & Reasoning
### Langkah 1: Analisis Masalah
- **Identifikasi**: Hasil npm start.
- **Edge Cases**: 
  - Private key salah format → throw error.
  - Tidak ada UTXO → beri pesan "no funds available".
  - Fee terlalu rendah → transaksi gagal dikonfirmasi.

### Langkah 2: Brainstorm Solusi
- **Opsi 1**: Gunakan `bitcoinjs-lib` untuk construct dan sign transaksi secara lokal.
  - Pros: Kontrol penuh, aman, nggak bergantung pihak ketiga.
  - Cons: Perlu fetch UTXO manual dari blockchain.
- **Opsi 2**: Gunakan API blockchain.info untuk sweep.
  - Pros: Lebih cepat implementasi.
  - Cons: Risiko keamanan, ketergantungan pada server eksternal.
- **Keputusan**: Pilih `bitcoinjs-lib` karena lebih aman dan sesuai dengan tujuan self-custody wallet.

### Langkah 3: Pseudocode
```plaintext
1. Validasi private key (cek format WIF).
2. Dapatkan public address dari private key.
3. Fetch UTXO untuk address via blockchain API.
4. Jika UTXO kosong, return "no funds".
5. Buat PSBT, tambahkan input (UTXO) dan output (alamat tujuan, change).
6. Hitung fee berdasarkan tx size dan fee rate.
7. Sign transaksi dengan private key.
8. Broadcast transaksi ke network.
9. Return txid.
