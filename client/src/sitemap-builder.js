require('babel-register')({
  presets: ["es2015", "react"]
});

const router = require('./sitemap-router.jsx').default;
const fetch = require("node-fetch");
const Sitemap = require("react-router-sitemap").default;

const filterConfig = {
	isValid: false,
	rules: [
		/\/auth/,
		/\*/,
	],
};
const base_url = "https://www.therotation.club"

function itemInfoForItem(item) {
  var str = item.title+"-"+item.subtitle+"-"+item.id;
  return str.replace(/\s+/g, '-').toLowerCase();
}

async function generateSitemap() {
    var item_urls = [];
    await fetch(`${base_url}/api/web/items`, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(results => {
      var items = results.items
      
      for(var i = 0; i < items.length; i++) {
        item_urls.push({ itemInfo: itemInfoForItem(items[i]) });
      }
    })

    const paramsConfig = {
      '/catalog/:itemInfo': item_urls
    };
    
    console.log(item_urls)

    return (
      new Sitemap(router)
          .filterPaths(filterConfig)
          .applyParams(paramsConfig)
          .build(base_url, { limitCountPaths: 5000 })
          .save('./public/sitemap.xml')
    );
}

generateSitemap()