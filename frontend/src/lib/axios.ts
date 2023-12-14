import axios from "axios";

export const BASE_URL = "http://localhost:8090";
export const API_URL = BASE_URL.concat("/api");

export const apiInstance = axios.create({
  baseURL: API_URL,
});

apiInstance.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
apiInstance.defaults.headers.post["Access-Control-Allow-Credentials"] = "true";
apiInstance.defaults.headers.post["Access-Control-Allow-Headers"] =
  "DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization";
apiInstance.defaults.headers.post["Access-Control-Allow-Methods"] =
  "GET,POST,PUT,DELETE,OPTIONS";
