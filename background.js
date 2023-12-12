const COINBASE_BTC_PRICE_URL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

const setBadge = (amt) => {
  let num = parseFloat(amt);
  let scale = Math.floor(Math.log10(num));
  let unit = scale < 3 ? '' : scale < 6 ? 'k' : 'M';
  let divisor = scale < 3 ? 1 : scale < 6 ? 1e3 : 1e6;
  let precision = scale % 3 === 2 ? 0 : 1;

  let text = num < 100 ? num.toFixed(2) : num >= 1e8 ? "HIGH" : (num / divisor).toFixed(precision) + unit;

  chrome.action.setBadgeText({ text });
};

const fetchPrice = async () => {
  const response = await fetch(COINBASE_BTC_PRICE_URL);
  const data = await response.json();
  setBadge(data.data.amount);
};

fetchPrice();
chrome.alarms.create('fetchPrice', { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetchPrice') {
    fetchPrice();
  }
});
