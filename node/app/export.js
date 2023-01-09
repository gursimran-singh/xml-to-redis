const redis = require("redis");
const yargs = require("yargs");
const fs = require("fs");
const xml2js = require("xml2js");

const redisClient = redis.createClient({
  host: "redis",
  port: 6379,
});

// read command line options.
const options = yargs(process.argv.slice(2)).argv;

try {
  // check for path option, if missing, throw error.
  if (!options.p) {
    throw new Error("missing argument p");
  }
  const v = options.v;

  const fp = fs.readFileSync(options.p);
  xml2js.parseString(fp, (err, content) => {
    let key = "";

    // if subdomain key is present
    if (content.config?.subdomains) {
      key = "subdomains";
      redisClient.set(
        key,
        JSON.stringify(content.config.subdomains[0].subdomain)
      );

      if (v) {
        console.log(key);
      }
    }

    //if cookies key is present
    if (content.config?.cookies) {
      key = "";
      content.config.cookies[0].cookie.forEach((ele) => {
        key = `cookie:${ele["$"].name}:${ele["$"].host}`;
        redisClient.set(key, ele._);

        if (v) {
          console.log(key);
        }
      });
    }
    if (!v) {
      console.log("successfully exported file");
    }
  });
} catch (err) {
  console.log(err.message);
}

// stop the redis client
redisClient.quit();
