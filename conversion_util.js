function satoshiToBtc(amount) {
  return (amount / 100000000).toFixed(8);
}

function btcToSatoshi(amount) {
  return Math.floor(amount * 100000000);
}

module.exports = {
  satoshiToBtc,
  btcToSatoshi,
};