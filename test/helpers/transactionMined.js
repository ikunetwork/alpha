// from https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6

web3.eth.transactionMined = function(txnHash, interval) {
  const _interval = interval || 500;

  const transactionReceiptAsync = function(_txnHash, resolve, reject) {
    try {
      const receipt = web3.eth.getTransactionReceipt(_txnHash);
      if (receipt === null) {
        setTimeout(() => {
          transactionReceiptAsync(_txnHash, resolve, reject);
        }, _interval);
      } else {
        resolve(receipt);
      }
    } catch (e) {
      reject(e);
    }
  };

  if (Array.isArray(txnHash)) {
    const promises = [];
    txnHash.forEach(oneTxHash => {
      promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
    });
    return Promise.all(promises);
  } else {
    return new Promise((resolve, reject) => {
      transactionReceiptAsync(txnHash, resolve, reject);
    });
  }
};

module.export = web3.eth.transactionMined;
