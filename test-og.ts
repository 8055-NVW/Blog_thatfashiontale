import ogs from 'open-graph-scraper';

const test = async () => {
  const { result, error } = await ogs({
    url: 'https://uk.pinterest.com/pin/1266706140933832/',
  });

  if (error) {
    console.error("❌ Failed to fetch OG data:", result);
  } else {
    console.log("✅ Open Graph Data:");
    console.log(result);
  }
};

test();
