const { Translate } = require("@google-cloud/translate").v2; //Require the package
require("dotenv").config(); //dotenv to secure credentials
const { getKeyVal, saveKey } = require("./cache/redis_cache");

// Reading the credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const TranslateClient = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

//Detect the language of input text

const detectLanguage = async (text) => {
  try {
    let response = await TranslateClient.detect(text);
    // console.log(languages);
    return response[0].language;
  } catch (error) {
    console.log(`Error at detectLanguage --> ${error}`);
    return 0;
  }
};

const translateText = async (text, sourceLanguage, targetLanguage) => {
  try {
    const options = {
      from: sourceLanguage,
      to: targetLanguage,
    };

    const keyString =
      text.toLowerCase() + " " + sourceLanguage + " " + targetLanguage;

    //Checking for cache
    const cacheReply = await getKeyVal(keyString);

    if (cacheReply) {
      console.log("Cached Value");
      return cacheReply;
    }

    //If not present then make request to API
    let [response] = await TranslateClient.translate(text, options);

    //Saving the result of cache
    const saveResult = await saveKey(keyString, response);

    console.log("New Cache saved");
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return 0;
  }
};

module.exports = {
  detectLanguage,
  translateText,
  TranslateClient,
};
