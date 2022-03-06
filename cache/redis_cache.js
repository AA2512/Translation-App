const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient({
  host: "redis-14274.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  password: "Adityaagr00**",
  port: 14274,
});

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// const testFunc = async () => {
//   const result = await setAsync("foo", "boo", );
//   console.log(result);
// };

// testFunc();

const getKeyVal = async (key) => {
  try {
    const result = await getAsync(key);
    return result;
  } catch (error) {
    return { error: "Not able to get the value" };
  }
};

const saveKey = async (key, value) => {
  try {
    const saveResult = await setAsync(key, value, "EX", 10);
    return saveResult;
  } catch (error) {
    return { error: "Not able to cache" };
  }
};

module.exports = {
  getKeyVal,
  saveKey,
};
