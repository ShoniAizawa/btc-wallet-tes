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
- **Error MODULE_NOT_FOUND:** Pesan error menunjukkan bahwa modul ../config tidak ditemukan. Ini biasanya terjadi karena:
  - File config.js tidak ada di lokasi yang diharapkan (kemungkinan di direktori root proyek atau di folder tertentu).
  - Path yang digunakan di file http.js salah, misalnya ../config tidak merujuk ke file yang benar.
- **Require Stack:**
  - Error berasal dari `explorer/http.js` yang mencoba mengimpor ../config.
  - File `http.js` dipanggil oleh `explorer/explorer.js`, kemudian oleh `utils.js`, dan akhirnya oleh `index.js`.
  - Ini menunjukkan bahwa struktur proyek memiliki ketergantungan pada file konfigurasi yang hilang atau salah letak. 

### Langkah 2: Mengatasi Error MODULE_NOT_FOUND
- **Memeriksa File config.js**: mencari file config.js di direktori proyek.
  - setelah saya periksa ternyata tidak ada file `config.js` maka saya perlu membuat file `config.js` yang diperlukan oleh http.js.
  - file `config.json` saya isi dengan:
      - ```plaintext
        {
        "network": "testnet",
        "apiBase": "https://blockstream.info/testnet/api",
        "mnemonic": "rifle gorilla erupt sponsor fiscal casual enough paddle rib always adapt slow"
        }
  - memastikan file ini berada di lokasi yang benar dan di folder yang sesuai dengan path ../config dari explorer/http.js
    
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
