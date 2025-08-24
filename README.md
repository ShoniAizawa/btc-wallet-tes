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
<img width="1443" height="1079" alt="Screenshot 2025-08-24 at 13 32 46" src="https://github.com/user-attachments/assets/e341f77e-bcab-4d74-bf7b-4f9e59f27f78" />

- **Identifikasi**: Hasil npm start.
- **Error MODULE_NOT_FOUND:** Pesan error menunjukkan bahwa modul ../config tidak ditemukan. Ini biasanya terjadi karena:
  - File config.js tidak ada di lokasi yang diharapkan (kemungkinan di direktori root proyek atau di folder tertentu).
  - Path yang digunakan di file http.js salah, misalnya ../config tidak merujuk ke file yang benar.
- **Require Stack:**
  - Error berasal dari `explorer/http.js` yang mencoba mengimpor ../config.
  - File `http.js` dipanggil oleh `explorer/explorer.js`, kemudian oleh `utils.js`, dan akhirnya oleh `index.js`.
  - Ini menunjukkan bahwa struktur proyek memiliki ketergantungan pada file konfigurasi yang hilang atau salah letak. 

### Langkah 2: Mengatasi "Error MODULE_NOT_FOUND" 
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
    
- **Menjalankan ulang aplikasi**
```
npm start
```
<img width="1006" height="476" alt="Screenshot 2025-08-24 at 13 46 46" src="https://github.com/user-attachments/assets/7e6a8f85-ff1e-4a3a-8919-f581925fec7e" />
  - Output ini menunjukkan bahwa aplikasi berhasil terhubung ke jaringan testnet dan menampilkan informasi dasar seperti tinggi blockchain dan hash blok terakhir. Namun, masalah muncul saat aplikasi mencoba menampilkan QR code untuk alamat deposit, yang ternyata bernilai `undefined`

- **Detail Error:**
    - Lokasi Error: /node_modules/qrcode-terminal/vendor/QRCode/QR8bitByte.js:11
    - Penyebab: Modul `qrcode-terminal` mencoba mengakses properti `length` dari `this.data` tetapi `this.data` adalah `undefined`
      Ini terjadi karena fungsi generate di `qrcode-terminal` dipanggil dengan parameter yang tidak valid (alamat deposit yang `undefined`).
    - Stack Trace:
      - Error berasal dari `utils.js:16` di fungsi `printQR`, yang memanggil `qrcode-terminal` untuk menghasilkan QR code.
      - Fungsi `printQR` dipanggil oleh `refresh` di `utils.js:136`.

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
