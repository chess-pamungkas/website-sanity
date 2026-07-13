const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "ms3sz7xq",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

client
  .fetch(
    `*[_type == "tradingHubPage"][0]{
      _id,
      heroBadge,
      heroTitle,
      heroSubtitle,
      heroImageDesktop{asset->{url}},
      heroImageMobile{asset->{url}}
    }`
  )
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  });
