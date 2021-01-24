function pause(seconds) {
  return new Promise(resolve => {
      console.log(`Pausing for ${seconds} seconds...`);
      setTimeout(() => resolve(), seconds * 1000);
  });
}

module.exports = {
  pause
};