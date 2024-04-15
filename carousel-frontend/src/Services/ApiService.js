import axios from "axios";
import { Config } from "../Config";
import Auth from "./Auth";

const baseURL = Config.apiBaseURL;
const auth = new Auth();

const GetApiService = (
  url,
  header = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + auth.getSingle("token"),
  },
) => {
  return axios({
    baseURL: baseURL,
    url: url,
    method: "get",
    headers: header,
  });
};
const PostApiService = (url, postData, header = { "Content-Type": "application/json" }) => {
  return axios({
    baseURL: baseURL,
    url: url,
    method: "post",
    headers: header,
    data: postData,
  });
};
const GeneralApiService = (
  url,
  postData,
  header = {
    "Content-Type": "application/json",
  },
  method = "post",
) => {
  return axios({
    baseURL: baseURL,
    url: url,
    method: method,
    headers: header,
    data: postData,
  });
};
const FileUploadApiService = (url, postData) => {
  return axios({
    baseURL: baseURL,
    url: url,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data: postData,
  });
};
export { GetApiService, PostApiService, GeneralApiService, FileUploadApiService };
